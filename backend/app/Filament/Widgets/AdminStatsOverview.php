<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Complaint;
use App\Models\Content;
use App\Models\ChatConversation;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminStatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('إجمالي المستخدمين', User::count())
                ->description('12.5% زيادة')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('info'),

            Stat::make('الشكاوى النشطة', Complaint::whereIn('status', ['new', 'in_progress'])->count())
                ->description('2.4% انخفاض')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('warning'),

            Stat::make('المحتوى المنشور اليوم', Content::whereDate('published_at', now())->count())
                ->description('5.2% زيادة')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),

            Stat::make('جلسات المساعد الذكي', ChatConversation::count())
                ->description('18.2% زيادة')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('primary'), // Purple in React, Primary here
        ];
    }
}
