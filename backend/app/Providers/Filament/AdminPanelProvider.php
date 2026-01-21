<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->viteTheme('resources/css/filament/admin/theme.css') // Custom CSS for Qomra font
            ->brandName('وزارة الاقتصاد والتجارة الخارجية')
            ->brandLogo(asset('assets/logo/11.png'))
            ->brandLogoHeight('3rem')
            ->favicon(asset('assets/logo/11.png'))
            ->colors([
                // Match frontend-next/tailwind.config.ts defaults
                'primary' => [
                    50 => '#f0fdfa',
                    100 => '#ccfbf1',
                    200 => '#99f6e4',
                    300 => '#5eead4',
                    400 => '#2dd4bf',
                    500 => '#428177', // gov-teal
                    600 => '#115E59', // gov-emeraldLight
                    700 => '#094239', // gov-forest (Primary Brand)
                    800 => '#06302a',
                    900 => '#042f2e',
                    950 => '#021817',
                ],
                'warning' => [
                    50 => '#fefce8',
                    100 => '#fef9c3',
                    200 => '#fef08a',
                    300 => '#fde047',
                    400 => '#facc15',
                    500 => '#b9a779', // gov-gold
                    600 => '#988561', // gov-sand
                    700 => '#a16207',
                    800 => '#854d0e',
                    900 => '#713f12',
                    950 => '#422006',
                ],
                'danger' => [
                    50 => '#fef2f2',
                    100 => '#fee2e2',
                    200 => '#fecaca',
                    300 => '#fca5a5',
                    400 => '#f87171',
                    500 => '#ef4444',
                    600 => '#dc2626',
                    700 => '#b91c1c',
                    800 => '#991b1b',
                    900 => '#6b1f2a', // gov-red
                    950 => '#450a0a',
                ],
                'gray' => Color::Stone, // Matches gov-stone
                'info' => Color::Sky,
                'success' => Color::Emerald,
            ])
            ->font('Cairo') // Primary Arabic font from frontend
            ->darkMode(true)
            ->sidebarCollapsibleOnDesktop()
            ->navigationGroups([
                'Dashboard Overview' => 'Overview', // or Arabic equivalent
                'إدارة النظام' => 'Management', // Users & Roles
                'إدارة المحتوى' => 'Content Management', // News, Decrees...
                'الشكاوى' => 'Complaints',
                'المساعد الذكي' => 'AI Assistant',
                'التقارير وسجلات التدقيق' => 'Reports & Audit',
                'إعدادات النظام' => 'System Settings',
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                \App\Filament\Widgets\AdminStatsOverview::class,
                \App\Filament\Widgets\AdminComplaintsChart::class,
                \App\Filament\Widgets\AdminRecentActivity::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}

