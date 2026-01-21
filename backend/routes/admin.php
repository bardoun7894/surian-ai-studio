<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\ComplaintController;
use App\Http\Controllers\Admin\AIAssistantController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Dashboard Routes
|--------------------------------------------------------------------------
|
| Custom admin dashboard routes using the premium design templates.
| These routes are separate from Filament and provide a custom UI/UX.
|
*/

Route::middleware(['web', 'admin.ip'])->prefix('admin')->name('admin.')->group(function () {
    // Guest Routes (login page still accessible for IP-restricted users)
    Route::middleware('guest')->group(function () {
        Route::get('/login', [App\Http\Controllers\Admin\Auth\LoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [App\Http\Controllers\Admin\Auth\LoginController::class, 'login']);
    });

    // Authenticated Routes (NFR-08: IP restriction applied via group middleware)
    Route::middleware('auth')->group(function () {
        Route::post('/logout', [App\Http\Controllers\Admin\Auth\LoginController::class, 'logout'])->name('logout');
        
        Route::prefix('dashboard')->group(function () {
    // Main Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/search', [DashboardController::class, 'search'])->name('search');
    
    // Users & Roles Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // System Audit Logs
    Route::prefix('logs')->name('logs.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('index');
    });

    // Statistical Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\ReportController::class, 'index'])->name('index');
    });

    // General Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\SettingController::class, 'index'])->name('index');
        Route::put('/', [App\Http\Controllers\Admin\SettingController::class, 'update'])->name('update');
    });
    
    // Content Management
    Route::prefix('content')->name('content.')->group(function () {
        Route::get('/', [ContentController::class, 'index'])->name('index');
        Route::get('/create', [ContentController::class, 'create'])->name('create');
        Route::post('/', [ContentController::class, 'store'])->name('store');
        Route::post('/translate', [ContentController::class, 'translate'])->name('translate');
        Route::get('/{content}/edit', [ContentController::class, 'edit'])->name('edit');
        Route::put('/{content}', [ContentController::class, 'update'])->name('update');
        Route::delete('/{content}', [ContentController::class, 'destroy'])->name('destroy');
    });
    
    // Complaints Management
    Route::prefix('complaints')->name('complaints.')->group(function () {
        Route::get('/', [ComplaintController::class, 'index'])->name('index');
        Route::get('/kanban', [ComplaintController::class, 'kanban'])->name('kanban');
        
        // Forms Builder
        Route::prefix('forms')->name('forms.')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\ComplaintFormController::class, 'index'])->name('index');
            Route::get('/create', [App\Http\Controllers\Admin\ComplaintFormController::class, 'create'])->name('create');
            Route::post('/', [App\Http\Controllers\Admin\ComplaintFormController::class, 'store'])->name('store');
            Route::get('/{form}/edit', [App\Http\Controllers\Admin\ComplaintFormController::class, 'edit'])->name('edit');
            Route::put('/{form}', [App\Http\Controllers\Admin\ComplaintFormController::class, 'update'])->name('update');
            Route::delete('/{form}', [App\Http\Controllers\Admin\ComplaintFormController::class, 'destroy'])->name('destroy');
        });

        Route::get('/{complaint}', [ComplaintController::class, 'show'])->name('show');
        Route::put('/{complaint}/status', [ComplaintController::class, 'updateStatus'])->name('updateStatus');
        Route::post('/{complaint}/response', [ComplaintController::class, 'addResponse'])->name('addResponse');
    });
    
    // AI Assistant
    Route::prefix('ai')->name('ai.')->group(function () {
        Route::get('/logs', [AIAssistantController::class, 'logs'])->name('logs');
        Route::get('/analytics', [AIAssistantController::class, 'analytics'])->name('analytics');
        Route::post('/generate-report', [AIAssistantController::class, 'generateReport'])->name('generateReport');
    });
    
    // Directorates Management
    Route::prefix('directorates')->name('directorates.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\DirectorateController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\DirectorateController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\DirectorateController::class, 'store'])->name('store');
        Route::get('/{directorate}/edit', [App\Http\Controllers\Admin\DirectorateController::class, 'edit'])->name('edit');
        Route::put('/{directorate}', [App\Http\Controllers\Admin\DirectorateController::class, 'update'])->name('update');
        Route::delete('/{directorate}', [App\Http\Controllers\Admin\DirectorateController::class, 'destroy'])->name('destroy');
    });

    // FAQs Management
    Route::prefix('faqs')->name('faqs.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\FaqController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\FaqController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\FaqController::class, 'store'])->name('store');
        Route::get('/{faq}/edit', [App\Http\Controllers\Admin\FaqController::class, 'edit'])->name('edit');
        Route::put('/{faq}', [App\Http\Controllers\Admin\FaqController::class, 'update'])->name('update');
        Route::delete('/{faq}', [App\Http\Controllers\Admin\FaqController::class, 'destroy'])->name('destroy');
    });


    // API Endpoints for dynamic data
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/stats', [DashboardController::class, 'getStats'])->name('stats');
        Route::get('/chart-data', [DashboardController::class, 'getChartData'])->name('chartData');
        Route::get('/activity-feed', [DashboardController::class, 'getActivityFeed'])->name('activityFeed');
    });
    });
    });
});

