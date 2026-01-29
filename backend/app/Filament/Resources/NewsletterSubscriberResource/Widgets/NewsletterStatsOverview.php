<?php

namespace App\Filament\Resources\NewsletterSubscriberResource\Widgets;

use App\Models\NewsletterSubscriber;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class NewsletterStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $total = NewsletterSubscriber::count();
        $active = NewsletterSubscriber::where('status', 'active')->count();
        $unsubscribed = NewsletterSubscriber::where('status', 'unsubscribed')->count();
        $thisMonth = NewsletterSubscriber::where('status', 'active')
            ->whereMonth('subscribed_at', now()->month)
            ->whereYear('subscribed_at', now()->year)
            ->count();

        return [
            Stat::make('إجمالي المشتركين', $total)
                ->description('جميع المشتركين')
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'),
            Stat::make('المشتركين النشطين', $active)
                ->description('المشتركين الحاليين')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            Stat::make('ألغوا الاشتراك', $unsubscribed)
                ->description('إجمالي الإلغاءات')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
            Stat::make('اشتراكات هذا الشهر', $thisMonth)
                ->description('مشتركين جدد')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info'),
        ];
    }
}
