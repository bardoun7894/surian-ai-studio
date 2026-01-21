<?php

namespace App\Filament\User\Widgets;

use Filament\Widgets\Widget;

class QuickActionsWidget extends Widget
{
    protected static ?int $sort = 3;
    
    protected static string $view = 'filament.user.widgets.quick-actions';

    protected int | string | array $columnSpan = 'full';
}
