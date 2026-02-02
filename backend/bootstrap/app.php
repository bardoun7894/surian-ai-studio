<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\SecurityHeadersMiddleware::class,
            \App\Http\Middleware\SetLocaleMiddleware::class,
        ]);

        $middleware->throttleApi('300,1');

        $middleware->validateCsrfTokens(except: [
            'api/v1/auth/*',
            'api/v1/complaints/*',
            'api/v1/chat/*',
            'api/v1/public/*',
            'api/v1/suggestions/*',
            'api/v1/webhooks/*',
            'api/v1/contact',
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'session.timeout' => \App\Http\Middleware\CheckSessionTimeout::class,
            'role' => \App\Http\Middleware\CheckRole::class,
            'directorate' => \App\Http\Middleware\CheckDirectorate::class,
            'admin.ip' => \App\Http\Middleware\AdminIpRestrictionMiddleware::class, // NFR-08
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصادق. يرجى تسجيل الدخول.',
                    'message_en' => 'Unauthenticated.',
                    'error_code' => 'UNAUTHENTICATED',
                ], 401);
            }
        });

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح لك بتنفيذ هذا الإجراء.',
                    'message_en' => 'Unauthorized action.',
                    'error_code' => 'FORBIDDEN',
                ], 403);
            }
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                $model = class_basename($e->getModel());
                return response()->json([
                    'success' => false,
                    'message' => 'العنصر المطلوب غير موجود.',
                    'message_en' => "{$model} not found.",
                    'error_code' => 'NOT_FOUND',
                ], 404);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'المسار المطلوب غير موجود.',
                    'message_en' => 'Endpoint not found.',
                    'error_code' => 'NOT_FOUND',
                ], 404);
            }
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات غير صالحة.',
                    'message_en' => 'Validation failed.',
                    'error_code' => 'VALIDATION_ERROR',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.',
                    'message_en' => 'Too many requests. Please try again later.',
                    'error_code' => 'RATE_LIMITED',
                    'retry_after' => $e->getHeaders()['Retry-After'] ?? null,
                ], 429);
            }
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'طريقة الطلب غير مسموحة.',
                    'message_en' => 'Method not allowed.',
                    'error_code' => 'METHOD_NOT_ALLOWED',
                ], 405);
            }
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') && !app()->hasDebugModeEnabled()) {
                return response()->json([
                    'success' => false,
                    'message' => 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
                    'message_en' => 'Internal server error.',
                    'error_code' => 'SERVER_ERROR',
                ], 500);
            }
        });
    })->create();
