<?php

namespace App\Services;

use App\Models\Content;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;

class VectorSearchService
{
    protected string $aiServiceUrl;
    protected int $timeout = 30;
    protected int $targetDimensions = 1024;

    public function __construct()
    {
        $this->aiServiceUrl = config('services.ai.url', 'http://ai-service:8000');
        $this->targetDimensions = (int) config('services.ai.embedding_dimensions', 1024);
    }

    /**
     * FR-36: Perform semantic search using vector similarity
     */
    public function semanticSearch(string $query, int $limit = 20): Collection
    {
        try {
            // Generate embedding for the search query
            $result = $this->generateEmbedding($query);

            if (!$result || empty($result['embedding'])) {
                Log::warning('Failed to generate embedding for search query, falling back to text search');
                return collect([]);
            }

            $queryEmbedding = $result['embedding'];
            $currentModel = $result['model'] ?? 'unknown';

            // Format embedding as PostgreSQL vector string
            $embeddingString = '[' . implode(',', $queryEmbedding) . ']';

            // Perform cosine similarity search
            // Only search embeddings from the same model for accurate results
            $results = DB::select("
                SELECT
                    id,
                    title_ar,
                    title_en,
                    content_ar,
                    content_en,
                    category,
                    slug,
                    embedding_model,
                    1 - (embedding <=> :embedding::vector) as similarity
                FROM contents
                WHERE status = 'published'
                    AND embedding IS NOT NULL
                    AND (embedding_model = :model OR embedding_model IS NULL)
                ORDER BY embedding <=> :embedding2::vector
                LIMIT :limit
            ", [
                'embedding' => $embeddingString,
                'embedding2' => $embeddingString,
                'model' => $currentModel,
                'limit' => $limit,
            ]);

            return collect($results)->filter(function ($item) {
                // Only return results with similarity > 0.5 (adjustable threshold)
                return $item->similarity > 0.5;
            });
        } catch (\Exception $e) {
            Log::error("Semantic search failed: {$e->getMessage()}");
            return collect([]);
        }
    }

    /**
     * Generate embedding for text using AI service
     * Returns full result with model info
     */
    public function generateEmbedding(string $text): ?array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->aiServiceUrl}/api/v1/ai/embeddings", [
                    'text' => $text,
                    'target_dim' => $this->targetDimensions,
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning("AI embedding service returned non-success status: {$response->status()}");
            return null;
        } catch (\Exception $e) {
            Log::error("Failed to generate embedding: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Update embedding for a content item
     */
    public function updateContentEmbedding(Content $content): bool
    {
        try {
            // Combine title and content for embedding
            $text = $content->title_ar . ' ' . $content->title_en . ' ' .
                    strip_tags($content->content_ar ?? '') . ' ' . strip_tags($content->content_en ?? '');

            $result = $this->generateEmbedding($text);

            if (!$result || empty($result['embedding'])) {
                return false;
            }

            $embeddingString = '[' . implode(',', $result['embedding']) . ']';
            $model = $result['model'] ?? 'unknown';

            DB::statement("
                UPDATE contents
                SET embedding = :embedding::vector,
                    embedding_model = :model,
                    embedding_updated_at = NOW()
                WHERE id = :id
            ", [
                'embedding' => $embeddingString,
                'model' => $model,
                'id' => $content->id,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to update embedding for content #{$content->id}: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Batch update embeddings for all content without embeddings
     * or with outdated model
     */
    public function updateAllEmbeddings(int $batchSize = 50, ?string $forceModel = null): array
    {
        $updated = 0;
        $failed = 0;

        // Get current model from a test embedding
        $currentModel = null;
        if ($forceModel) {
            $currentModel = $forceModel;
        } else {
            $testResult = $this->generateEmbedding('test');
            $currentModel = $testResult['model'] ?? null;
        }

        // Find content needing embeddings:
        // - No embedding yet
        // - Different model (needs regeneration)
        $query = Content::where('status', 'published')
            ->where(function ($q) use ($currentModel) {
                $q->whereNull('embedding')
                  ->orWhere('embedding_model', '!=', $currentModel)
                  ->orWhereNull('embedding_model');
            })
            ->limit($batchSize);

        $contents = $query->get();

        foreach ($contents as $content) {
            if ($this->updateContentEmbedding($content)) {
                $updated++;
            } else {
                $failed++;
            }

            // Small delay to avoid overwhelming the AI service
            usleep(100000); // 100ms
        }

        $remaining = Content::where('status', 'published')
            ->where(function ($q) use ($currentModel) {
                $q->whereNull('embedding')
                  ->orWhere('embedding_model', '!=', $currentModel)
                  ->orWhereNull('embedding_model');
            })
            ->count();

        return [
            'updated' => $updated,
            'failed' => $failed,
            'remaining' => $remaining,
            'current_model' => $currentModel,
        ];
    }

    /**
     * Check if vector search is available (pgvector installed)
     */
    public function isAvailable(): bool
    {
        try {
            $result = DB::select("SELECT extname FROM pg_extension WHERE extname = 'vector'");
            return count($result) > 0;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get statistics about current embeddings
     */
    public function getStats(): array
    {
        try {
            $total = Content::where('status', 'published')->count();
            $withEmbedding = Content::where('status', 'published')
                ->whereNotNull('embedding')
                ->count();

            $byModel = DB::select("
                SELECT embedding_model, COUNT(*) as count
                FROM contents
                WHERE status = 'published' AND embedding IS NOT NULL
                GROUP BY embedding_model
            ");

            return [
                'total_content' => $total,
                'with_embedding' => $withEmbedding,
                'without_embedding' => $total - $withEmbedding,
                'coverage_percent' => $total > 0 ? round(($withEmbedding / $total) * 100, 1) : 0,
                'by_model' => collect($byModel)->keyBy('embedding_model')->map->count->toArray(),
                'pgvector_available' => $this->isAvailable(),
            ];
        } catch (\Exception $e) {
            Log::error("Failed to get embedding stats: {$e->getMessage()}");
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Clear all embeddings (use when changing models)
     */
    public function clearAllEmbeddings(): int
    {
        return DB::table('contents')
            ->whereNotNull('embedding')
            ->update([
                'embedding' => null,
                'embedding_model' => null,
                'embedding_updated_at' => null,
            ]);
    }
}
