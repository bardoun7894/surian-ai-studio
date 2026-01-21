<?php

namespace App\Console\Commands;

use App\Services\FaqSuggestionService;
use Illuminate\Console\Command;

class AnalyzeFaqSuggestions extends Command
{
    protected $signature = 'faq:analyze {--hours=24 : Hours to look back for conversations}';

    protected $description = 'FR-43: Analyze recent chat conversations for FAQ suggestions';

    public function handle(FaqSuggestionService $service): int
    {
        $hours = (int) $this->option('hours');

        $this->info("Analyzing conversations from the last {$hours} hours...");

        $result = $service->analyzeConversations($hours);

        $this->info("Analysis complete:");
        $this->info("  - Conversations analyzed: {$result['analyzed']}");
        $this->info("  - New suggestions created: {$result['suggestions']}");

        // Show current stats
        $stats = $service->getStats();
        $this->newLine();
        $this->info("Current FAQ Suggestion Stats:");
        $this->table(
            ['Metric', 'Count'],
            [
                ['Pending', $stats['total_pending']],
                ['Approved', $stats['total_approved']],
                ['Rejected', $stats['total_rejected']],
                ['High Confidence', $stats['high_confidence']],
                ['Frequently Asked', $stats['frequent']],
            ]
        );

        return Command::SUCCESS;
    }
}
