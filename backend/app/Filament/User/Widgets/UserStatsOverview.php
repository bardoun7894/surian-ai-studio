<?php

namespace App\Filament\User\Widgets;

use App\Models\Complaint;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStatsOverview extends BaseWidget
{
    protected static ?int $sort = -2;

    protected function getStats(): array
    {
        return [
            Stat::make('شكاواية', Complaint::where('user_id', auth()->id())->count())
                ->description('إجمالي الشكاوى المقدمة')
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('primary'),

            Stat::make('قيد المعالجة', Complaint::where('user_id', auth()->id())->where('status', 'in_progress')->count())
                ->description('شكاوى يتم العمل عليها')
                ->descriptionIcon('heroicon-m-arrow-path')
                ->color('warning'),

            Stat::make('تمت المعالجة', Complaint::where('user_id', auth()->id())->where('status', 'resolved')->count())
                ->description('شكاوى تم حلها')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success'),
        ];
    }
}
