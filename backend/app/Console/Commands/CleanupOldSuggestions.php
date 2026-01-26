<?php

namespace App\Console\Commands;

use App\Models\Suggestion;
use Illuminate\Console\Command;

class CleanupOldSuggestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'suggestions:cleanup-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive suggestions older than 1 year';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Suggestion::where('created_at', '<', now()->subYear())
            ->delete();

        $this->info("Archived {$count} old suggestions.");
    }
}
