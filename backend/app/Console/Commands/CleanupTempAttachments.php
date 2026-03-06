<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;

/**
 * Bug #316: Cleanup temporary attachments older than 24 hours.
 * Schedule: Run hourly via `php artisan schedule:run`.
 */
class CleanupTempAttachments extends Command
{
    protected $signature = 'attachments:cleanup-temp';
    protected $description = 'Delete temporary attachment files older than 24 hours';

    public function handle(): int
    {
        $disk = Storage::disk('public');
        $directory = 'temp-attachments';

        if (!$disk->exists($directory)) {
            $this->info('No temp-attachments directory found. Nothing to clean.');
            return self::SUCCESS;
        }

        $files = $disk->files($directory);
        $deleted = 0;
        $cutoff = Carbon::now()->subHours(24);

        foreach ($files as $file) {
            $lastModified = Carbon::createFromTimestamp($disk->lastModified($file));
            if ($lastModified->lt($cutoff)) {
                $disk->delete($file);
                $deleted++;
            }
        }

        $this->info("Cleaned up {$deleted} temporary attachment(s).");
        return self::SUCCESS;
    }
}
