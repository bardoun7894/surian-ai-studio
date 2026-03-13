<?php

namespace App\Console\Commands;

use App\Models\Content;
use App\Services\AIService;
use Illuminate\Console\Command;

class SeedMediaEnglishTitles extends Command
{
    protected $signature = 'media:seed-english-titles {--dry-run : Show what would be translated without saving} {--force : Overwrite existing English titles}';
    protected $description = 'Translate missing English titles for media content items using the AI translation service';

    public function handle(AIService $aiService): int
    {
        $query = Content::where('category', 'media')
            ->where('status', 'published')
            ->whereNotNull('title_ar')
            ->where('title_ar', '!=', '');

        if (!$this->option('force')) {
            $query->where(function ($q) {
                $q->whereNull('title_en')
                  ->orWhere('title_en', '');
            });
        }

        $items = $query->get();

        if ($items->isEmpty()) {
            $this->info('All media items already have English titles.');
            return 0;
        }

        $this->info("Found {$items->count()} media items to translate.");
        $isDryRun = $this->option('dry-run');

        if ($isDryRun) {
            $this->warn('DRY RUN - no changes will be saved.');
        }

        $bar = $this->output->createProgressBar($items->count());
        $bar->start();

        $translated = 0;
        $failed = 0;

        foreach ($items as $item) {
            $englishTitle = $aiService->translate($item->title_ar, 'ar', 'en');

            if ($englishTitle) {
                if (!$isDryRun) {
                    $item->update(['title_en' => $englishTitle]);
                }
                $this->line(" [{$item->id}] {$item->title_ar} => {$englishTitle}");
                $translated++;
            } else {
                $this->error(" [{$item->id}] Failed to translate: {$item->title_ar}");
                $failed++;
            }

            $bar->advance();
            usleep(500000); // 0.5s delay to avoid rate limiting
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Done. Translated: {$translated}, Failed: {$failed}");

        return $failed > 0 ? 1 : 0;
    }
}
