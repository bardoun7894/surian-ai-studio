<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'version' => '1.0']);
    });

    // Public Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);
        Route::post('verify-2fa', [\App\Http\Controllers\AuthController::class, 'verify2fa']);
        Route::post('register', [\App\Http\Controllers\UserController::class, 'register']);
    });

    // Complaint Public/Guest Routes
    Route::prefix('complaints')->group(function () {
        Route::get('templates', [\App\Http\Controllers\ComplaintController::class, 'indexTemplates']);
        Route::post('otp/send', [\App\Http\Controllers\ComplaintController::class, 'sendOtp']);
        Route::post('otp/verify', [\App\Http\Controllers\ComplaintController::class, 'verifyOtp']);

        // FR-27: Rate limit complaint submissions (3 per day)
        Route::post('/', [\App\Http\Controllers\ComplaintController::class, 'store'])
            ->middleware(\App\Http\Middleware\ComplaintRateLimitMiddleware::class);

        Route::get('track/{trackingNumber}', [\App\Http\Controllers\ComplaintController::class, 'track']); // T066
        Route::get('{trackingNumber}/print', [\App\Http\Controllers\ComplaintController::class, 'print']); // FR-28
        Route::get('{trackingNumber}/pdf', [\App\Http\Controllers\ComplaintController::class, 'printPdf']); // FR-28: PDF Download
    });

    // Content Public Routes
    Route::get('content', [\App\Http\Controllers\ContentController::class, 'index']);

    // Public API Routes (for Next.js frontend)
    Route::prefix('public')->group(function () {
        // Directorates
        Route::get('directorates', [\App\Http\Controllers\Api\PublicApiController::class, 'directorates']);
        Route::get('directorates/featured', [\App\Http\Controllers\Api\PublicApiController::class, 'featuredDirectorates']); // FR-49-51
        Route::get('directorates/{id}', [\App\Http\Controllers\Api\PublicApiController::class, 'directorate']);
        Route::get('directorates/{id}/services', [\App\Http\Controllers\Api\PublicApiController::class, 'directorateServices']);
        Route::get('directorates/{id}/news', [\App\Http\Controllers\Api\PublicApiController::class, 'directorateNews']); // FR-11
        Route::get('directorates/{id}/sub-directorates', [\App\Http\Controllers\Api\PublicApiController::class, 'directorateSubDirectorates']); // FR-49-51

        // News
        Route::get('news', [\App\Http\Controllers\Api\PublicApiController::class, 'news']);
        Route::get('news/breaking', [\App\Http\Controllers\Api\PublicApiController::class, 'breakingNews']);
        Route::get('news/hero', [\App\Http\Controllers\Api\PublicApiController::class, 'heroArticle']);
        Route::get('news/grid', [\App\Http\Controllers\Api\PublicApiController::class, 'gridArticles']);
        Route::get('news/{id}', [\App\Http\Controllers\Api\PublicApiController::class, 'newsItem']);

        // Announcements
        Route::get('announcements', [\App\Http\Controllers\Api\PublicApiController::class, 'announcements']);
        Route::get('announcements/{id}', [\App\Http\Controllers\Api\PublicApiController::class, 'announcement']);

        // Decrees
        Route::get('decrees', [\App\Http\Controllers\Api\PublicApiController::class, 'decrees']);

        // Services
        Route::get('services', [\App\Http\Controllers\Api\PublicApiController::class, 'services']);
        Route::get('services/{id}', [\App\Http\Controllers\Api\PublicApiController::class, 'service']);

        // Media
        Route::get('media', [\App\Http\Controllers\Api\PublicApiController::class, 'media']);

        // FAQs
        Route::get('faqs', [\App\Http\Controllers\Api\PublicApiController::class, 'faqs']);

        // Search
        Route::get('search', [\App\Http\Controllers\Api\PublicApiController::class, 'search']);

        // FR-36: Semantic Search with Filters
        Route::get('search/semantic', [\App\Http\Controllers\Api\PublicApiController::class, 'semanticSearch']);

        // FR-42: Public Settings
        Route::get('settings', [\App\Http\Controllers\Api\SettingsController::class, 'getPublicSettings']);
    });

    // Suggestions Routes (FR-52 to FR-56)
    Route::prefix('suggestions')->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'store']); // Public submission
    });

    // Chat Routes (Public - FR-31 to FR-35)
    Route::prefix('chat')->group(function () {
        Route::post('message', [\App\Http\Controllers\Api\ChatController::class, 'sendMessage']);
        Route::get('history/{sessionId}', [\App\Http\Controllers\Api\ChatController::class, 'getHistory']);
        Route::delete('session/{sessionId}', [\App\Http\Controllers\Api\ChatController::class, 'clearSession']);
        Route::post('handoff', [\App\Http\Controllers\Api\ChatController::class, 'requestHandoff']); // FR-35
    });


    // Authenticated Auth Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
             Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);
             Route::get('me', [\App\Http\Controllers\AuthController::class, 'me']);
             Route::post('password/reset', [\App\Http\Controllers\UserController::class, 'resetPassword']);
        });

        // User Routes
        Route::put('users/me', [\App\Http\Controllers\UserController::class, 'updateProfile']);
        Route::get('users/me/complaints', [\App\Http\Controllers\ComplaintController::class, 'myComplaints']); // T067
        Route::delete('complaints/{id}', [\App\Http\Controllers\ComplaintController::class, 'destroy']); // FR-22: Delete complaint

        // User Notification Preferences
        Route::get('user/notification-preferences', [\App\Http\Controllers\UserController::class, 'getNotificationPreferences']);
        Route::put('user/notification-preferences', [\App\Http\Controllers\UserController::class, 'updateNotificationPreferences']);

        // Notifications Routes (FR-44, FR-45, FR-46, FR-48)
        Route::prefix('notifications')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
            Route::get('unread-count', [\App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
            Route::put('{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
            Route::put('read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
            Route::delete('{id}', [\App\Http\Controllers\Api\NotificationController::class, 'destroy']);
        });

        // Admin/Staff Routes
        Route::middleware('role:admin.*,staff')->prefix('staff')->group(function () {
            Route::get('complaints', [\App\Http\Controllers\ComplaintController::class, 'listAllComplaints']);
            Route::put('complaints/{id}/status', [\App\Http\Controllers\ComplaintController::class, 'updateStatus']);
            Route::put('complaints/{id}/categorization', [\App\Http\Controllers\ComplaintController::class, 'updateCategorization']);
            Route::get('complaints/{id}/logs', [\App\Http\Controllers\ComplaintController::class, 'getComplaintLogs']);
            Route::post('complaints/{id}/response', [\App\Http\Controllers\ComplaintController::class, 'addResponse']);
            Route::get('analytics', [\App\Http\Controllers\ComplaintController::class, 'getDashboardAnalytics']);

            // FR-35: Chat Handoff Management
            Route::prefix('chat/handoffs')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\ChatController::class, 'listHandoffs']);
                Route::put('{id}/assign', [\App\Http\Controllers\Api\ChatController::class, 'assignHandoff']);
                Route::post('{id}/respond', [\App\Http\Controllers\Api\ChatController::class, 'respondToHandoff']);
                Route::put('{id}/close', [\App\Http\Controllers\Api\ChatController::class, 'closeHandoff']);
            });
        });

        Route::middleware('role:admin.*')->prefix('admin')->group(function () {
            Route::post('users', [\App\Http\Controllers\UserController::class, 'store']);
            Route::put('users/{id}/disable', [\App\Http\Controllers\UserController::class, 'toggleStatus']);

            // CMS Content Routes (T096-T104)
            Route::apiResource('content', \App\Http\Controllers\ContentController::class);

            // FR-13: Content Attachments Routes
            Route::prefix('content/{contentId}/attachments')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'index']);
                Route::post('/', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'store']);
                Route::get('{attachmentId}', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'show']);
                Route::get('{attachmentId}/download', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'download']);
                Route::put('{attachmentId}', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'update']);
                Route::delete('{attachmentId}', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'destroy']);
            });

            // FR-42: System Settings Routes
            Route::prefix('settings')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\SettingsController::class, 'index']);
                Route::get('group/{group}', [\App\Http\Controllers\Api\SettingsController::class, 'getGroup']);
                Route::get('{key}', [\App\Http\Controllers\Api\SettingsController::class, 'show']);
                Route::put('{key}', [\App\Http\Controllers\Api\SettingsController::class, 'update']);
                Route::post('/', [\App\Http\Controllers\Api\SettingsController::class, 'store']);
                Route::post('bulk', [\App\Http\Controllers\Api\SettingsController::class, 'bulkUpdate']);
                Route::delete('{key}', [\App\Http\Controllers\Api\SettingsController::class, 'destroy']);
                Route::post('cache/clear', [\App\Http\Controllers\Api\SettingsController::class, 'clearCache']);
            });

            // FR-43: FAQ Suggestion Routes
            Route::prefix('faq-suggestions')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'index']);
                Route::get('stats', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'stats']);
                Route::get('{id}', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'show']);
                Route::post('{id}/approve', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'approve']);
                Route::post('{id}/reject', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'reject']);
                Route::get('{id}/enhance', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'enhance']);
                Route::post('analyze', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'analyze']);
                Route::post('bulk/approve', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'bulkApprove']);
                Route::post('bulk/reject', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'bulkReject']);
                Route::delete('{id}', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'destroy']);
            });

            // FR-52 to FR-56: Suggestions Management (Admin)
            Route::prefix('suggestions')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'index']);
                Route::get('{id}', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'show']);
                Route::patch('{id}/status', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'updateStatus']);
                Route::delete('{id}', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'destroy']);
            });
        });

        // Reports Routes (FR-38, FR-39)
        Route::middleware('role:admin.*,staff')->prefix('reports')->group(function () {
            Route::get('statistics', [\App\Http\Controllers\Api\ReportsController::class, 'statistics']);
            Route::get('export', [\App\Http\Controllers\Api\ReportsController::class, 'export']);
            Route::get('audit', [\App\Http\Controllers\Api\ReportsController::class, 'audit']);

            // FR-39: AI Complaint Summaries
            Route::get('summaries', [\App\Http\Controllers\Api\ReportsController::class, 'summaries']);
            Route::get('summaries/latest', [\App\Http\Controllers\Api\ReportsController::class, 'latestSummary']);
            Route::get('summaries/{id}', [\App\Http\Controllers\Api\ReportsController::class, 'showSummary']);
        });

        // NFR-05: Backup Routes (Admin only)
        Route::middleware('role:admin.*')->prefix('backup')->group(function () {
            Route::post('create', [\App\Http\Controllers\Api\BackupController::class, 'create']);
            Route::get('list', [\App\Http\Controllers\Api\BackupController::class, 'list']);
            Route::get('download/{filename}', [\App\Http\Controllers\Api\BackupController::class, 'download']);
            Route::delete('{filename}', [\App\Http\Controllers\Api\BackupController::class, 'destroy']);
            Route::post('export', [\App\Http\Controllers\Api\BackupController::class, 'export']);
        });

        Route::get('/user', function (Request $request) {
            return $request->user();
        });
    });
});
