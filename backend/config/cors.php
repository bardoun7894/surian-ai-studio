<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'auth/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_merge(
        [
            env('FRONTEND_URL', 'http://localhost:8080'),
            env('APP_URL'),
            'http://localhost:3000',
            'http://localhost:3002',
            'http://localhost:3120',
            'http://localhost:8080',
            'http://127.0.0.1:3000',
            'http://frontend-next:3000',
        ],
        // Additional origins from env (comma-separated)
        array_map('trim', explode(',', env('CORS_EXTRA_ORIGINS', '')))
    )),

    'allowed_origins_patterns' => [
        // Allow any subdomain of your production domain
        '/^https:\/\/[a-zA-Z0-9\-]+\.gov\.sy$/',
        // Allow public IP access on any port
        '/^https?:\/\/91\.230\.110\.187(:\d+)?$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-CSRF-TOKEN'],

    'max_age' => 7200, // 2 hours cache for preflight

    'supports_credentials' => true,

];
