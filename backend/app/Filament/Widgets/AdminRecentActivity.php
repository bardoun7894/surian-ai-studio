<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class AdminRecentActivity extends Widget
{
    protected static ?int $sort = 3;
    
    protected int | string | array $columnSpan = 1;

    protected static string $view = 'filament.widgets.admin-recent-activity';
}
