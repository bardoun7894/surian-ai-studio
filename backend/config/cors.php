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

    'allowed_origins' => array_filter([
        env('FRONTEND_URL', 'http://localhost:8080'),
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://frontend-next:3000',
        'http://91.230.110.187:3002',
        'http://91.230.110.187:8002',
        // Production URL if different
        env('APP_URL'),
    ]),

    'allowed_origins_patterns' => [
        // Allow any subdomain of your production domain
        '/^https?:\/\/.*\.gov\.sy$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-CSRF-TOKEN'],

    'max_age' => 7200, // 2 hours cache for preflight

    'supports_credentials' => true,

];
