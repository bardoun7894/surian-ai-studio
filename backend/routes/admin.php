<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\ComplaintController;
use App\Http\Controllers\Admin\AIAssistantController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\InvestmentController;
use App\Http\Controllers\Admin\PromotionalSectionController;
use App\Http\Controllers\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Admin\QuickLinkController;
use App\Http\Controllers\Admin\ComplaintTemplateController;
use App\Http\Controllers\Admin\SuggestionController;
use App\Http\Controllers\Admin\SubDirectorateController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\FaqSuggestionController;
use App\Http\Controllers\Admin\ChatConversationController;
use App\Http\Controllers\Admin\SystemSettingController;
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

    // Redirect /admin to /admin/dashboard
    Route::get('/', function () {
        return redirect('/admin/dashboard');
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


    // Roles & Permissions Management
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::get('/create', [RoleController::class, 'create'])->name('create');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
    });

    // Services Management
    Route::prefix('services')->name('services.')->group(function () {
        Route::get('/', [ServiceController::class, 'index'])->name('index');
        Route::get('/create', [ServiceController::class, 'create'])->name('create');
        Route::post('/', [ServiceController::class, 'store'])->name('store');
        Route::get('/{service}/edit', [ServiceController::class, 'edit'])->name('edit');
        Route::put('/{service}', [ServiceController::class, 'update'])->name('update');
        Route::delete('/{service}', [ServiceController::class, 'destroy'])->name('destroy');
    });

    // Investments Management
    Route::prefix('investments')->name('investments.')->group(function () {
        Route::get('/', [InvestmentController::class, 'index'])->name('index');
        Route::get('/create', [InvestmentController::class, 'create'])->name('create');
        Route::post('/', [InvestmentController::class, 'store'])->name('store');
        Route::get('/{investment}/edit', [InvestmentController::class, 'edit'])->name('edit');
        Route::put('/{investment}', [InvestmentController::class, 'update'])->name('update');
        Route::delete('/{investment}', [InvestmentController::class, 'destroy'])->name('destroy');
    });

    // Promotional Sections Management
    Route::prefix('promotional')->name('promotional.')->group(function () {
        Route::get('/', [PromotionalSectionController::class, 'index'])->name('index');
        Route::get('/create', [PromotionalSectionController::class, 'create'])->name('create');
        Route::post('/', [PromotionalSectionController::class, 'store'])->name('store');
        Route::get('/{section}', fn (\App\Models\PromotionalSection $section) => redirect()->route('admin.promotional.edit', $section))->name('show');
        Route::get('/{section}/edit', [PromotionalSectionController::class, 'edit'])->name('edit');
        Route::put('/{section}', [PromotionalSectionController::class, 'update'])->name('update');
        Route::delete('/{section}', [PromotionalSectionController::class, 'destroy'])->name('destroy');
    });

    // Newsletter Subscribers
    Route::prefix('newsletter')->name('newsletter.')->group(function () {
        Route::get('/', [NewsletterSubscriberController::class, 'index'])->name('index');
        Route::delete('/{subscriber}', [NewsletterSubscriberController::class, 'destroy'])->name('destroy');
    });

    // Quick Links Management
    Route::prefix('quick-links')->name('quick-links.')->group(function () {
        Route::get('/', [QuickLinkController::class, 'index'])->name('index');
        Route::get('/create', [QuickLinkController::class, 'create'])->name('create');
        Route::post('/', [QuickLinkController::class, 'store'])->name('store');
        Route::get('/{quickLink}/edit', [QuickLinkController::class, 'edit'])->name('edit');
        Route::put('/{quickLink}', [QuickLinkController::class, 'update'])->name('update');
        Route::delete('/{quickLink}', [QuickLinkController::class, 'destroy'])->name('destroy');
    });

    // Complaint Templates Management
    Route::prefix('complaint-templates')->name('complaint-templates.')->group(function () {
        Route::get('/', [ComplaintTemplateController::class, 'index'])->name('index');
        Route::get('/create', [ComplaintTemplateController::class, 'create'])->name('create');
        Route::post('/', [ComplaintTemplateController::class, 'store'])->name('store');
        Route::get('/{complaintTemplate}/edit', [ComplaintTemplateController::class, 'edit'])->name('edit');
        Route::put('/{complaintTemplate}', [ComplaintTemplateController::class, 'update'])->name('update');
        Route::delete('/{complaintTemplate}', [ComplaintTemplateController::class, 'destroy'])->name('destroy');
    });

    // Suggestions Management
    Route::prefix('suggestions')->name('suggestions.')->group(function () {
        Route::get('/', [SuggestionController::class, 'index'])->name('index');
        Route::get('/kanban', [SuggestionController::class, 'kanban'])->name('kanban');
        Route::get('/{suggestion}', [SuggestionController::class, 'show'])->name('show');
        Route::put('/{suggestion}/status', [SuggestionController::class, 'updateStatus'])->name('updateStatus');
    });

    // Sub-Directorates Management
    Route::prefix('sub-directorates')->name('sub-directorates.')->group(function () {
        Route::get('/', [SubDirectorateController::class, 'index'])->name('index');
        Route::get('/create', [SubDirectorateController::class, 'create'])->name('create');
        Route::post('/', [SubDirectorateController::class, 'store'])->name('store');
        Route::get('/{subDirectorate}/edit', [SubDirectorateController::class, 'edit'])->name('edit');
        Route::put('/{subDirectorate}', [SubDirectorateController::class, 'update'])->name('update');
        Route::delete('/{subDirectorate}', [SubDirectorateController::class, 'destroy'])->name('destroy');
    });

    // Notifications Management
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/{notification}', [NotificationController::class, 'show'])->name('show');
        Route::delete('/{notification}', [NotificationController::class, 'destroy'])->name('destroy');
    });

    // FAQ Suggestions (AI-generated)
    Route::prefix('faq-suggestions')->name('faq-suggestions.')->group(function () {
        Route::get('/', [FaqSuggestionController::class, 'index'])->name('index');
        Route::post('/{faqSuggestion}/approve', [FaqSuggestionController::class, 'approve'])->name('approve');
        Route::post('/{faqSuggestion}/reject', [FaqSuggestionController::class, 'reject'])->name('reject');
    });

    // Chat Conversations
    Route::prefix('chat-conversations')->name('chat-conversations.')->group(function () {
        Route::get('/', [ChatConversationController::class, 'index'])->name('index');
        Route::get('/{chatConversation}', [ChatConversationController::class, 'show'])->name('show');
    });

    // System Settings (Advanced)
    Route::prefix('system-settings')->name('system-settings.')->group(function () {
        Route::get('/', [SystemSettingController::class, 'index'])->name('index');
        Route::put('/', [SystemSettingController::class, 'update'])->name('update');
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

