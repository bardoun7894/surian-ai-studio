<?php

namespace App\Filament\Widgets;

use App\Models\Complaint;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

/**
 * T-SRS2-05: Filament satisfaction indicator widget
 * Displays user satisfaction metrics for complaint resolution
 */
class SatisfactionStatsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected static ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        $user = auth()->user();
        $directorateId = $user?->directorate_id;

        // Base query with optional directorate filter
        $baseQuery = Complaint::whereNotNull('rating');
        if ($directorateId) {
            $baseQuery = $baseQuery->where('directorate_id', $directorateId);
        }

        $totalRated = (clone $baseQuery)->count();
        $averageRating = round((clone $baseQuery)->avg('rating') ?? 0, 2);

        // Satisfaction rate (ratings >= 4)
        $satisfied = (clone $baseQuery)->where('rating', '>=', 4)->count();
        $satisfactionRate = $totalRated > 0 ? round(($satisfied / $totalRated) * 100, 1) : 0;

        // Rating distribution
        $fiveStars = (clone $baseQuery)->where('rating', 5)->count();
        $fourStars = (clone $baseQuery)->where('rating', 4)->count();
        $threeStars = (clone $baseQuery)->where('rating', 3)->count();
        $twoStars = (clone $baseQuery)->where('rating', 2)->count();
        $oneStar = (clone $baseQuery)->where('rating', 1)->count();

        // Trend (compare last 30 days to previous 30 days)
        $last30Days = (clone $baseQuery)
            ->where('rated_at', '>=', now()->subDays(30))
            ->avg('rating') ?? 0;
        $previous30Days = (clone $baseQuery)
            ->whereBetween('rated_at', [now()->subDays(60), now()->subDays(30)])
            ->avg('rating') ?? 0;

        $trend = $previous30Days > 0
            ? round((($last30Days - $previous30Days) / $previous30Days) * 100, 1)
            : 0;

        $trendIcon = $trend >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down';
        $trendColor = $trend >= 0 ? 'success' : 'danger';

        return [
            Stat::make('معدل الرضا', $satisfactionRate . '%')
                ->description('نسبة التقييمات 4+ نجوم')
                ->descriptionIcon('heroicon-m-face-smile')
                ->color($satisfactionRate >= 70 ? 'success' : ($satisfactionRate >= 50 ? 'warning' : 'danger'))
                ->chart($this->getSatisfactionChart($directorateId)),

            Stat::make('متوسط التقييم', $averageRating . ' / 5')
                ->description($totalRated . ' تقييم')
                ->descriptionIcon('heroicon-m-star')
                ->color($averageRating >= 4 ? 'success' : ($averageRating >= 3 ? 'warning' : 'danger')),

            Stat::make('اتجاه الرضا', ($trend >= 0 ? '+' : '') . $trend . '%')
                ->description('مقارنة بالشهر السابق')
                ->descriptionIcon($trendIcon)
                ->color($trendColor),
        ];
    }

    /**
     * Get satisfaction trend chart data for last 7 days
     */
    protected function getSatisfactionChart(?int $directorateId): array
    {
        $data = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);

            $query = Complaint::whereNotNull('rating')
                ->whereDate('rated_at', $date);

            if ($directorateId) {
                $query->where('directorate_id', $directorateId);
            }

            $dayTotal = $query->count();
            $daySatisfied = (clone $query)->where('rating', '>=', 4)->count();

            $data[] = $dayTotal > 0 ? round(($daySatisfied / $dayTotal) * 100) : 0;
        }

        return $data;
    }

    public static function canView(): bool
    {
        $user = auth()->user();

        // Show to staff and admins
        return $user && $user->role && in_array($user->role->name, [
            'staff',
            'admin.general',
            'admin.super',
        ]);
    }
}
