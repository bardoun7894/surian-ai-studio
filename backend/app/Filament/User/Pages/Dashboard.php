<?php

namespace App\Filament\User\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static string $view = 'filament.user.pages.dashboard';

    public function getTitle(): string
    {
        return 'لوحة التحكم';
    }

    public function getHeading(): string
    {
        return 'مرحباً، ' . auth()->user()->name;
    }

    public function getSubheading(): ?string
    {
        return auth()->user()->email;
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\User\Widgets\UserStatsOverview::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            \App\Filament\User\Widgets\RecentComplaintsWidget::class,
            \App\Filament\User\Widgets\QuickActionsWidget::class,
        ];
    }
}
