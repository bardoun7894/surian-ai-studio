<?php

namespace App\Services;

use App\Models\Complaint;
use App\Models\Directorate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    protected string $aiServiceUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->aiServiceUrl = env('AI_SERVICE_URL', 'http://ai-service:8001');
        $this->timeout = (int) env('AI_SERVICE_TIMEOUT', 30);
    }

    /**
     * Classify a complaint using the AI service (FR-19)
     *
     * Calls the FastAPI AI service to:
     * - Determine the appropriate directorate
     * - Assign priority (high/medium/low)
     * - Generate a summary
     * - Extract keywords
     */
    public function classifyComplaint(Complaint $complaint): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->aiServiceUrl}/api/v1/ai/analyze-complaint", [
                    'complaint_text' => $complaint->description,
                    'attachments' => [], // TODO: Add attachment analysis if needed
                ]);

            if ($response->successful()) {
                $data = $response->json();

                // Map directorate name to ID if not provided
                $directorateId = $data['directorate_id'] ?? null;
                if (!$directorateId && isset($data['directorate'])) {
                    $directorate = Directorate::where('name_ar', 'like', "%{$data['directorate']}%")
                        ->orWhere('name_en', 'like', "%{$data['directorate']}%")
                        ->first();
                    $directorateId = $directorate?->id;
                }

                // Return enriched data (ComplaintService will handle updates)
                return [
                    'category' => $data['directorate'] ?? 'general',
                    'priority' => $data['priority'] ?? 'medium',
                    'summary' => $data['summary'] ?? mb_substr($complaint->description, 0, 200),
                    'keywords' => $data['keywords'] ?? [],
                    'confidence' => $data['confidence'] ?? 0.0,
                    'suggested_directorate_id' => $directorateId,
                ];
            }

            Log::warning("AI Service returned non-successful response for complaint #{$complaint->tracking_number}", [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Fallback to basic classification
            return $this->fallbackClassification($complaint);

        } catch (\Exception $e) {
            Log::error("AI Service error for complaint #{$complaint->tracking_number}: {$e->getMessage()}");

            // Fallback to basic classification on error
            return $this->fallbackClassification($complaint);
        }
    }

    /**
     * Fallback classification when AI service is unavailable
     */
    protected function fallbackClassification(Complaint $complaint): array
    {
        $description = mb_strtolower($complaint->description);

        $category = 'general';
        $priority = 'medium';
        $summary = mb_substr($complaint->description, 0, 200);

        // Arabic keyword detection
        $urgentKeywords = ['عاجل', 'طارئ', 'فوري', 'خطير', 'urgent', 'emergency'];
        $highPriorityKeywords = ['مهم', 'ضروري', 'سريع', 'important', 'critical'];

        foreach ($urgentKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                $priority = 'high';
                break;
            }
        }

        if ($priority !== 'high') {
            foreach ($highPriorityKeywords as $keyword) {
                if (str_contains($description, $keyword)) {
                    $priority = 'medium';
                    break;
                }
            }
        }

        // Category detection based on keywords
        $categories = [
            'تجارة' => ['تجارة', 'استيراد', 'تصدير', 'رخصة تجارية', 'سجل تجاري', 'trade', 'import', 'export'],
            'صناعة' => ['مصنع', 'صناعة', 'إنتاج', 'ورشة', 'factory', 'industry', 'manufacturing'],
            'حماية المستهلك' => ['غش', 'احتيال', 'سعر', 'جودة', 'مستهلك', 'consumer', 'fraud', 'quality'],
            'استثمار' => ['استثمار', 'مشروع', 'تمويل', 'investment', 'project'],
        ];

        foreach ($categories as $cat => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($description, $keyword)) {
                    $category = $cat;
                    break 2;
                }
            }
        }

        Log::info("Fallback Classification for Complaint #{$complaint->tracking_number}: {$category} / {$priority}");

        // Return structured data (ComplaintService will handle updates)
        return [
            'category' => $category,
            'priority' => $priority,
            'summary' => $summary,
            'keywords' => [],
            'confidence' => 0.5,
        ];
    }

    /**
     * Summarize content using AI service
     */
    public function summarize(string $text, string $language = 'ar'): ?string
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->aiServiceUrl}/api/v1/ai/summarize", [
                    'text' => $text,
                    'language' => $language,
                    'max_length' => 200,
                ]);

            if ($response->successful()) {
                return $response->json('summary');
            }
        } catch (\Exception $e) {
            Log::error("AI Summarize error: {$e->getMessage()}");
        }

        return null;
    }

    /**
     * Suggest titles for content using AI service
     */
    public function suggestTitles(string $content, string $contentType = 'news', string $language = 'ar'): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->aiServiceUrl}/api/v1/ai/suggest-title", [
                    'content' => $content,
                    'content_type' => $contentType,
                    'language' => $language,
                ]);

            if ($response->successful()) {
                return $response->json('titles') ?? [];
            }
        } catch (\Exception $e) {
            Log::error("AI Title Suggestion error: {$e->getMessage()}");
        }

        return [];
    }

    /**
     * Proofread text using AI service
     */
    public function proofread(string $text, string $language = 'ar'): ?array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->aiServiceUrl}/api/v1/ai/proofread", [
                    'text' => $text,
                    'language' => $language,
                ]);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error("AI Proofread error: {$e->getMessage()}");
        }

        return null;
    }

    /**
     * FR-39: Analyze recurring complaints and generate summary
     */
    public function analyzeRecurringComplaints(string $prompt): ?array
    {
        try {
            $response = Http::timeout($this->timeout * 2) // Allow more time for analysis
                ->post("{$this->aiServiceUrl}/api/v1/ai/analyze-recurring", [
                    'prompt' => $prompt,
                    'analysis_type' => 'recurring_complaints',
                ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'recurring_issues' => $data['recurring_issues'] ?? [],
                    'summary_ar' => $data['summary_ar'] ?? $data['summary'] ?? null,
                    'summary_en' => $data['summary_en'] ?? null,
                    'recommendations' => $data['recommendations'] ?? null,
                    'keywords' => $data['keywords'] ?? [],
                    'confidence' => $data['confidence'] ?? 0.7,
                ];
            }

            Log::warning("AI recurring analysis returned non-successful response", [
                'status' => $response->status(),
            ]);

        } catch (\Exception $e) {
            Log::error("AI recurring analysis error: {$e->getMessage()}");
        }

        return null;
    }

    /**
     * Generate embeddings for semantic search (FR-36)
     */
    public function generateEmbedding(string $text): ?array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->aiServiceUrl}/api/v1/ai/embed", [
                    'text' => $text,
                ]);

            if ($response->successful()) {
                return $response->json('embedding');
            }
        } catch (\Exception $e) {
            Log::error("AI Embedding error: {$e->getMessage()}");
        }

        return null;
    }

    /**
     * Translate text between Arabic and English
     *
     * @param string $text The text to translate
     * @param string $sourceLang Source language (ar or en)
     * @param string $targetLang Target language (ar or en)
     * @return string|null Translated text or null on failure
     */
    public function translate(string $text, string $sourceLang = 'ar', string $targetLang = 'en'): ?string
    {
        if (empty(trim($text))) {
            return null;
        }

        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->aiServiceUrl}/api/v1/ai/translate", [
                    'text' => $text,
                    'source_lang' => $sourceLang,
                    'target_lang' => $targetLang,
                ]);

            if ($response->successful()) {
                return $response->json('translated_text');
            }

            Log::warning("AI Translation returned non-successful response", [
                'status' => $response->status(),
            ]);

        } catch (\Exception $e) {
            Log::error("AI Translation error: {$e->getMessage()}");
        }

        return null;
    }
}
