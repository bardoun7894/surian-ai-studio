<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

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
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/v1/auth/*',
            'api/v1/complaints/*',
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
        //
    })->create();
