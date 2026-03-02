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
        Route::post('resend-2fa', [\App\Http\Controllers\AuthController::class, 'resend2fa'])
            ->middleware('throttle:3,10');
        Route::post('register', [\App\Http\Controllers\UserController::class, 'register']);

        // T-NX-07: CSRF route for Next.js Sanctum integration
        Route::get('csrf', function () {
            // This endpoint is used by Next.js to fetch CSRF cookie before login
            // The actual CSRF cookie is set by Laravel Sanctum via /sanctum/csrf-cookie
            // This endpoint provides a convenient API wrapper
            return response()->json([
                'csrf_token' => csrf_token(),
                'message' => 'CSRF token retrieved. Use /sanctum/csrf-cookie for cookie-based auth.'
            ]);
        });

        // Password reset routes
        Route::post('forgot-password', [\App\Http\Controllers\AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [\App\Http\Controllers\AuthController::class, 'resetPassword']);
    });

    // Complaint Public/Guest Routes
    Route::prefix('complaints')->group(function () {
        Route::get('templates', [\App\Http\Controllers\ComplaintController::class, 'indexTemplates']);
        Route::post('otp/send', [\App\Http\Controllers\ComplaintController::class, 'sendOtp']);
        Route::post('otp/verify', [\App\Http\Controllers\ComplaintController::class, 'verifyOtp']);

        // FR-27: Rate limit complaint submissions (3 per day)
        Route::post('/', [\App\Http\Controllers\ComplaintController::class, 'store'])
            ->middleware(\App\Http\Middleware\ComplaintRateLimitMiddleware::class);

        Route::post('track/{trackingNumber}', [\App\Http\Controllers\ComplaintController::class, 'track']); // T066
        Route::get('{trackingNumber}/print', [\App\Http\Controllers\ComplaintController::class, 'print']); // FR-28
        Route::get('{trackingNumber}/pdf', [\App\Http\Controllers\ComplaintController::class, 'printPdf']); // FR-28: PDF Download
        Route::post('{trackingNumber}/rate', [\App\Http\Controllers\ComplaintController::class, 'rate']); // FR-25: User satisfaction rating
    });

    // Content Public Routes
    Route::get('content', [\App\Http\Controllers\ContentController::class, 'index']);

    // Public API Routes (for Next.js frontend)
    Route::prefix('public')->group(function () {
        // Directorates
        Route::get('directorates', [\App\Http\Controllers\Api\PublicApiController::class, 'directorates']);
        Route::get('directorates/featured', [\App\Http\Controllers\Api\PublicApiController::class, 'featuredDirectorates']); // FR-49-51
        Route::get('directorates/map', [\App\Http\Controllers\Api\DirectorateMapController::class, 'map']); // T082
        Route::get('directorates/{id}', [\App\Http\Controllers\Api\PublicApiController::class, 'directorate']);
        Route::get('directorates/{id}/services', [\App\Http\Controllers\Api\PublicApiController::class, 'directorateServices']);
        Route::get('directorates/{id}/news', [\App\Http\Controllers\Api\PublicApiController::class, 'directorateNews']); // FR-11
        Route::get('directorates/{id}/announcements', [\App\Http\Controllers\Api\PublicApiController::class, 'directorateAnnouncements']);
        Route::get('directorates/{id}/sub-directorates', [\App\Http\Controllers\Api\PublicApiController::class, 'directorateSubDirectorates']); // FR-49-51

        // News
        Route::get('news/by-directorate', [\App\Http\Controllers\Api\PublicApiController::class, 'newsByDirectorate']); // FR-13
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

        // Public decree attachment download
        Route::get('decrees/{contentId}/attachments/{attachmentId}/download', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'download']);

        // Services
        Route::get('services', [\App\Http\Controllers\Api\PublicApiController::class, 'services']);
        Route::get('services/{id}', [\App\Http\Controllers\Api\PublicApiController::class, 'service']);

        // Media
        Route::get('media', [\App\Http\Controllers\Api\PublicApiController::class, 'media']);
        Route::get('media/{id}/photos', [\App\Http\Controllers\Api\PublicApiController::class, 'albumPhotos']);

        // FAQs
        Route::get('faqs', [\App\Http\Controllers\Api\PublicApiController::class, 'faqs']);

        // Search
        Route::get('search', [\App\Http\Controllers\Api\PublicApiController::class, 'search']);

        // T070: Search Autocomplete
        // Government Partners (Public)
        Route::get('government-partners', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'index']);

        Route::get('search/autocomplete', [\App\Http\Controllers\Api\SearchAutocompleteController::class, 'autocomplete'])->middleware('throttle:30,1');

        // FR-36: Semantic Search with Filters
        Route::get('search/semantic', [\App\Http\Controllers\Api\PublicApiController::class, 'semanticSearch']);

        // FR-42: Public Settings
        Route::get('settings/ui', [\App\Http\Controllers\Api\SettingsController::class, 'getUiSettings']); // T-MOD-038
        Route::get('settings', [\App\Http\Controllers\Api\SettingsController::class, 'getPublicSettings']);
        Route::get('settings/group/{group}', [\App\Http\Controllers\Api\SettingsController::class, 'getPublicSettingsByGroup']);

        // Complaint Templates
        Route::get('complaint-templates', [\App\Http\Controllers\Api\PublicApiController::class, 'getComplaintTemplates']);

        // Contact Form
        Route::post('contact', [\App\Http\Controllers\Api\PublicApiController::class, 'submitContactForm'])->middleware('throttle:5,1');

        // Happiness Feedback (مؤشر الرضا)
        Route::post('happiness-feedback', [\App\Http\Controllers\Api\PublicApiController::class, 'submitHappinessFeedback'])->middleware('throttle:10,1');
        Route::get('happiness-feedback/stats', [\App\Http\Controllers\Api\PublicApiController::class, 'getHappinessFeedbackStats']);

        // Suggestion Ratings
        Route::post('suggestions/rating', [\App\Http\Controllers\Api\PublicApiController::class, 'submitSuggestionRating'])->middleware('throttle:3,1');
        Route::get('suggestions/ratings/stats', [\App\Http\Controllers\Api\PublicApiController::class, 'getSuggestionRatingsStats']);

        // Open Data
        Route::get('open-data', [\App\Http\Controllers\Api\PublicApiController::class, 'openData']);

        // Quick Links
        Route::get('quick-links', [\App\Http\Controllers\Api\PublicApiController::class, 'quickLinks']);

        // Static Pages (privacy, terms, about)
        Route::get('pages/{slug}', [\App\Http\Controllers\Api\PublicApiController::class, 'staticPage']);

        // Investment Portal Routes
        Route::prefix('investments')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\InvestmentController::class, 'index']);
            Route::get('stats', [\App\Http\Controllers\Api\InvestmentController::class, 'stats']);
            Route::get('category/{category}', [\App\Http\Controllers\Api\InvestmentController::class, 'byCategory']);
            Route::get('{id}', [\App\Http\Controllers\Api\InvestmentController::class, 'show']);
        });

        // Promotional Sections Routes
        Route::prefix('promotional-sections')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'index']);
            Route::get('position/{position}', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'byPosition']);
            Route::get('{id}', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'show']);
        });

        // Newsletter Routes
        Route::prefix('newsletter')->group(function () {
            Route::post('subscribe', [\App\Http\Controllers\Api\NewsletterController::class, 'subscribe'])->middleware('throttle:5,1');
            Route::post('unsubscribe', [\App\Http\Controllers\Api\NewsletterController::class, 'unsubscribe']);
        });

        // AI Assistant
        Route::prefix('ai')->group(function () {
            Route::post('summarize', [\App\Http\Controllers\Api\PublicApiController::class, 'summarize'])->middleware('throttle:5,1');
        });

        // National ID Verification Routes
        Route::post('verify-national-id', [\App\Http\Controllers\Api\NationalIdController::class, 'verify'])
            ->middleware('throttle:10,1'); // 10 requests per minute
        Route::post('validate-national-id', [\App\Http\Controllers\Api\NationalIdController::class, 'validateFormat'])
            ->middleware('throttle:30,1'); // 30 requests per minute
    });

    // Suggestions Routes (FR-52 to FR-56)
    Route::prefix('suggestions')->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'store']); // Public submission
        Route::get('track/{trackingNumber}', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'track']); // FR-55: Track suggestion status
        Route::get('{trackingNumber}/print', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'printView']); // T-SRS2-10: Print view
    });

    // Chat Routes (Public - FR-31 to FR-35)
    Route::prefix('chat')->group(function () {
        Route::post('message', [\App\Http\Controllers\Api\ChatController::class, 'sendMessage']);
        Route::get('history/{sessionId}', [\App\Http\Controllers\Api\ChatController::class, 'getHistory']);
        Route::delete('session/{sessionId}', [\App\Http\Controllers\Api\ChatController::class, 'clearSession']);
        Route::post('handoff', [\App\Http\Controllers\Api\ChatController::class, 'requestHandoff']); // FR-35
    });

    // FR-53: WhatsApp Webhook Routes (Public - for Meta/Facebook callbacks)
    Route::prefix('webhooks/whatsapp')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\WhatsAppWebhookController::class, 'verify']); // Webhook verification
        Route::post('/', [\App\Http\Controllers\Api\WhatsAppWebhookController::class, 'webhook']); // Receive messages
    });

    // FR-53: Telegram Webhook Routes (Public - for Telegram callbacks)
    Route::prefix('webhooks/telegram')->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\TelegramWebhookController::class, 'webhook']); // Receive messages
    });


    // Authenticated Auth Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
             Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);
             Route::get('me', [\App\Http\Controllers\AuthController::class, 'me']);
             Route::post('password/reset', [\App\Http\Controllers\UserController::class, 'resetPassword']);
             Route::post('verify-password', [\App\Http\Controllers\AuthController::class, 'verifyPassword']);
        });

        // User Routes
        Route::put('users/me', [\App\Http\Controllers\UserController::class, 'updateProfile']);

        // T028: Favorites Routes
        Route::prefix('favorites')->group(function () {
            Route::get('/', [\App\Http\Controllers\FavoriteController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\FavoriteController::class, 'store']);
            Route::delete('{content_type}/{content_id}', [\App\Http\Controllers\FavoriteController::class, 'destroy']);
            Route::post('check', [\App\Http\Controllers\FavoriteController::class, 'check']);
        });

        // T066: Email change routes (rate limited)
        Route::post('users/me/email/request-change', [\App\Http\Controllers\UserController::class, 'requestEmailChange'])
            ->middleware('throttle:5,15');
        Route::post('users/me/email/verify-change', [\App\Http\Controllers\UserController::class, 'verifyEmailChange'])
            ->middleware('throttle:10,15');
        Route::get('users/me/complaints', [\App\Http\Controllers\ComplaintController::class, 'myComplaints']); // T067
        Route::get('users/me/suggestions', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'mySuggestions']); // Get user's suggestions
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
        Route::middleware('role:complaints.view,complaints.*,admin.*')->prefix('staff')->group(function () {
            Route::get('complaints', [\App\Http\Controllers\ComplaintController::class, 'listAllComplaints']);
            Route::put('complaints/{id}/status', [\App\Http\Controllers\ComplaintController::class, 'updateStatus']);
            Route::put('complaints/{id}/categorization', [\App\Http\Controllers\ComplaintController::class, 'updateCategorization']);
            Route::get('complaints/{id}/logs', [\App\Http\Controllers\ComplaintController::class, 'getComplaintLogs']);
            Route::post('complaints/{id}/response', [\App\Http\Controllers\ComplaintController::class, 'addResponse']);
            Route::get('analytics', [\App\Http\Controllers\ComplaintController::class, 'getDashboardAnalytics']);

            // FR-35: Snooze complaint routes
            Route::post('complaints/{id}/snooze', [\App\Http\Controllers\ComplaintController::class, 'snooze']);
            Route::delete('complaints/{id}/snooze', [\App\Http\Controllers\ComplaintController::class, 'unsnooze']);

            // T-SRS2-04: User satisfaction analytics
            Route::get('analytics/satisfaction', [\App\Http\Controllers\ComplaintController::class, 'getSatisfactionAnalytics']);

            // FR-35: Chat Handoff Management
            Route::prefix('chat/handoffs')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\ChatController::class, 'listHandoffs']);
                Route::put('{id}/assign', [\App\Http\Controllers\Api\ChatController::class, 'assignHandoff']);
                Route::post('{id}/respond', [\App\Http\Controllers\Api\ChatController::class, 'respondToHandoff']);
                Route::put('{id}/close', [\App\Http\Controllers\Api\ChatController::class, 'closeHandoff']);
            });
        });

        Route::middleware(['role:admin.panel', 'admin.ip'])->prefix('admin')->group(function () {
            // User Management (FR-01 to FR-10)
            Route::middleware('role:users.view,users.*,admin.*')->group(function () {
                Route::get('users', [\App\Http\Controllers\UserController::class, 'index']);
                Route::get('users/{id}', [\App\Http\Controllers\UserController::class, 'show']);
                Route::post('users', [\App\Http\Controllers\UserController::class, 'store']);
                Route::put('users/{id}', [\App\Http\Controllers\UserController::class, 'update']);
                Route::put('users/{id}/disable', [\App\Http\Controllers\UserController::class, 'toggleStatus']);
            });

            // CMS Content Routes (T096-T104)
            Route::middleware('role:content.view,content.*,admin.*')->group(function () {
                Route::apiResource('content', \App\Http\Controllers\ContentController::class);

                // Media Upload Routes
                Route::post('media/upload', [\App\Http\Controllers\Api\MediaUploadController::class, 'store']);
                Route::delete('media/{id}', [\App\Http\Controllers\Api\MediaUploadController::class, 'destroy']);

                // FR-13: Content Attachments Routes
                Route::prefix('content/{contentId}/attachments')->group(function () {
                    Route::get('/', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'index']);
                    Route::post('/', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'store']);
                    Route::get('{attachmentId}', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'show']);
                    Route::get('{attachmentId}/download', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'download']);
                    Route::put('{attachmentId}', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'update']);
                    Route::delete('{attachmentId}', [\App\Http\Controllers\Api\ContentAttachmentController::class, 'destroy']);
                });

                // FR-14: Content Versioning Routes
                Route::prefix('content/{contentId}/versions')->group(function () {
                    Route::get('/', [\App\Http\Controllers\Api\ContentVersionController::class, 'index']);
                    Route::get('{versionNumber}', [\App\Http\Controllers\Api\ContentVersionController::class, 'show']);
                    Route::post('{versionNumber}/restore', [\App\Http\Controllers\Api\ContentVersionController::class, 'restore']);
                    Route::get('{versionNumber}/compare', [\App\Http\Controllers\Api\ContentVersionController::class, 'compare']);
                });
            });

            // T082: Directorate Location Management
            Route::put('directorates/{id}/location', [\App\Http\Controllers\Api\DirectorateMapController::class, 'updateLocation']);

            // FR-42: System Settings Routes
            Route::middleware('role:settings.manage,settings.*,admin.*')->prefix('settings')->group(function () {
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
            Route::middleware('role:faq.view,faq.*,admin.*')->prefix('faq-suggestions')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'index']);
                Route::get('stats', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'stats']);
                Route::get('snoozed', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'snoozed']); // FR-58
                Route::get('{id}', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'show']);
                Route::post('{id}/approve', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'approve']);
                Route::post('{id}/reject', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'reject']);
                Route::post('{id}/snooze', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'snooze']); // FR-58
                Route::delete('{id}/snooze', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'unsnooze']); // FR-58
                Route::get('{id}/enhance', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'enhance']);
                Route::post('analyze', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'analyze']);
                Route::post('bulk/approve', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'bulkApprove']);
                Route::post('bulk/reject', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'bulkReject']);
                Route::delete('{id}', [\App\Http\Controllers\Api\FaqSuggestionController::class, 'destroy']);
            });

            // FR-52 to FR-56: Suggestions Management (Admin)
            Route::middleware('role:suggestions.view,suggestions.*,admin.*')->prefix('suggestions')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'index']);
                Route::get('{id}', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'show']);
                Route::patch('{id}/status', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'updateStatus']);
                Route::delete('{id}', [\App\Http\Controllers\Api\V1\SuggestionController::class, 'destroy']);
            });

            // Newsletter Management (Admin)
            Route::middleware('role:newsletter.view,newsletter.*,admin.*')->prefix('newsletter')->group(function () {
                Route::get('stats', [\App\Http\Controllers\Api\NewsletterController::class, 'stats']);
                Route::get('subscribers', [\App\Http\Controllers\Api\NewsletterController::class, 'index']);
                Route::delete('subscribers/{id}', [\App\Http\Controllers\Api\NewsletterController::class, 'destroy']);
                Route::get('export', [\App\Http\Controllers\Api\NewsletterController::class, 'export']);
                Route::post('send', [\App\Http\Controllers\Api\NewsletterController::class, 'send']);
            });

            // Government Partners Management (Admin) - M11.9
            Route::middleware('role:content.view,content.*,admin.*')->prefix('government-partners')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'adminIndex']);
                Route::get('{id}', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'show']);
                Route::post('/', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'store']);
                Route::post('{id}', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'update']);
                Route::delete('{id}', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'destroy']);
                Route::patch('{id}/toggle-active', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'toggleActive']);
                Route::post('reorder', [\App\Http\Controllers\Api\GovernmentPartnerController::class, 'reorder']);
            });

            // Promotional Sections Management (Admin)
            Route::middleware('role:promotional.view,promotional.*,admin.*')->prefix('promotional-sections')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'adminIndex']);
                Route::get('stats', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'stats']);
                Route::get('{id}', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'adminShow']);
                Route::post('/', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'store']);
                Route::put('{id}', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'update']);
                Route::delete('{id}', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'destroy']);
                Route::patch('{id}/toggle-active', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'toggleActive']);
                Route::post('reorder', [\App\Http\Controllers\Api\PromotionalSectionController::class, 'reorder']);
            });
        });

        // Reports Routes (FR-38, FR-39)
        Route::middleware('role:reports.view,reports.*,admin.*')->prefix('reports')->group(function () {
            Route::get('statistics', [\App\Http\Controllers\Api\ReportsController::class, 'statistics']);
            Route::get('export', [\App\Http\Controllers\Api\ReportsController::class, 'export']);
            Route::get('audit', [\App\Http\Controllers\Api\ReportsController::class, 'audit']);

            // FR-39: AI Complaint Summaries
            Route::get('summaries', [\App\Http\Controllers\Api\ReportsController::class, 'summaries']);
            Route::get('summaries/latest', [\App\Http\Controllers\Api\ReportsController::class, 'latestSummary']);
            Route::get('summaries/{id}', [\App\Http\Controllers\Api\ReportsController::class, 'showSummary']);
        });

        // NFR-05: Backup Routes (Admin only)
        Route::middleware('role:backups.manage,backups.*,admin.*')->prefix('backup')->group(function () {
            Route::post('create', [\App\Http\Controllers\Api\BackupController::class, 'create']);
            Route::get('list', [\App\Http\Controllers\Api\BackupController::class, 'list']);
            Route::get('download/{filename}', [\App\Http\Controllers\Api\BackupController::class, 'download']);
            Route::delete('{filename}', [\App\Http\Controllers\Api\BackupController::class, 'destroy']);
            Route::post('export', [\App\Http\Controllers\Api\BackupController::class, 'export']);
        });

        // FR-53: Webhook Management Routes (Admin only)
        Route::middleware('role:settings.manage,settings.*,admin.*')->prefix('admin/webhooks')->group(function () {
            // WhatsApp
            Route::get('whatsapp/status', [\App\Http\Controllers\Api\WhatsAppWebhookController::class, 'status']);

            // Telegram
            Route::get('telegram/status', [\App\Http\Controllers\Api\TelegramWebhookController::class, 'status']);
            Route::post('telegram/set', [\App\Http\Controllers\Api\TelegramWebhookController::class, 'setWebhook']);
            Route::delete('telegram', [\App\Http\Controllers\Api\TelegramWebhookController::class, 'deleteWebhook']);
            Route::get('telegram/info', [\App\Http\Controllers\Api\TelegramWebhookController::class, 'getWebhookInfo']);
        });

        Route::get('/user', function (Request $request) {
            return $request->user();
        });
    });
});
