<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Complaint;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class AdminComplaintsChart extends ChartWidget
{
    protected static ?string $heading = 'تحليل الشكاوى (آخر 7 أيام)';
    
    protected static ?int $sort = 2;
    
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = Trend::model(Complaint::class)
            ->between(
                start: now()->subDays(7),
                end: now(),
            )
            ->perDay()
            ->count();
 
        return [
            'datasets' => [
                [
                    'label' => 'الشكاوى',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                    'backgroundColor' => '#428177', // gov-teal
                    'borderColor' => '#094239', // gov-forest
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
