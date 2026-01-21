<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// FR-45: Check for overdue complaints daily at 8 AM
Schedule::command('complaints:check-overdue --days=7')
    ->dailyAt('08:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/overdue-complaints.log'));

// FR-36: Update content embeddings nightly
Schedule::command('content:update-embeddings --batch=100')
    ->dailyAt('02:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/embeddings.log'));

// FR-46: Check for security events hourly
Schedule::command('security:check --hours=1')
    ->hourly()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/security.log'));

// FR-43: Analyze chatbot conversations for FAQ suggestions daily
Schedule::command('faq:analyze --hours=24')
    ->dailyAt('06:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/faq-suggestions.log'));

// FR-39: Generate weekly complaint summary every Monday at 7 AM
Schedule::command('complaints:generate-summary --type=weekly --all-directorates')
    ->weeklyOn(1, '07:00') // Monday at 7 AM
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/complaint-summaries.log'));

// FR-39: Generate monthly complaint summary on 1st of each month at 6 AM
Schedule::command('complaints:generate-summary --type=monthly --all-directorates')
    ->monthlyOn(1, '06:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/complaint-summaries.log'));
