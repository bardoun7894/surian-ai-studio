<?php

namespace App\Console\Commands;

use App\Services\VectorSearchService;
use Illuminate\Console\Command;

class UpdateContentEmbeddings extends Command
{
    protected $signature = 'content:update-embeddings
        {--batch=50 : Number of items to process per batch}
        {--stats : Show embedding statistics only}
        {--clear : Clear all embeddings (use before changing models)}';

    protected $description = 'Update vector embeddings for content items (FR-36: Semantic search)';

    public function handle(VectorSearchService $vectorSearch): int
    {
        if (!$vectorSearch->isAvailable()) {
            $this->error('pgvector extension is not available. Please install it first.');
            return Command::FAILURE;
        }

        // Show stats only
        if ($this->option('stats')) {
            $stats = $vectorSearch->getStats();
            $this->info('Embedding Statistics:');
            $this->table(
                ['Metric', 'Value'],
                collect($stats)->map(fn($v, $k) => [$k, is_array($v) ? json_encode($v) : $v])->values()->toArray()
            );
            return Command::SUCCESS;
        }

        // Clear all embeddings
        if ($this->option('clear')) {
            if (!$this->confirm('This will clear ALL embeddings. Are you sure?')) {
                return Command::SUCCESS;
            }
            $cleared = $vectorSearch->clearAllEmbeddings();
            $this->info("Cleared {$cleared} embeddings.");
            return Command::SUCCESS;
        }

        $batchSize = (int) $this->option('batch');
        $this->info("Updating embeddings in batches of {$batchSize}...");

        $totalUpdated = 0;
        $totalFailed = 0;
        $currentModel = null;

        do {
            $result = $vectorSearch->updateAllEmbeddings($batchSize);

            $totalUpdated += $result['updated'];
            $totalFailed += $result['failed'];
            $currentModel = $result['current_model'] ?? $currentModel;

            $this->line("Batch complete: {$result['updated']} updated, {$result['failed']} failed, {$result['remaining']} remaining");

            if ($result['remaining'] > 0 && $result['updated'] === 0) {
                $this->warn('No progress made in this batch. Stopping to prevent infinite loop.');
                break;
            }
        } while ($result['remaining'] > 0);

        $this->newLine();
        $this->info("Embedding update complete!");
        $this->info("Model: {$currentModel}");
        $this->info("Total updated: {$totalUpdated}");
        $this->info("Total failed: {$totalFailed}");

        return $totalFailed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
