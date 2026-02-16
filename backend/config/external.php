<?php

return [
    'ai_service' => [
        'url' => env('AI_SERVICE_URL', 'http://ai-service:8000'),
        'timeout' => (int) env('AI_SERVICE_TIMEOUT', 30),
    ],

    'recaptcha' => [
        'secret_key' => env('RECAPTCHA_SECRET_KEY'),
    ],

    'civil_registry' => [
        'enabled' => env('CIVIL_REGISTRY_ENABLED', false),
        'base_url' => env('CIVIL_REGISTRY_API_URL', 'https://civil-registry.gov.sy/api/v1'),
        'api_key' => env('CIVIL_REGISTRY_API_KEY', ''),
        'api_secret' => env('CIVIL_REGISTRY_API_SECRET', ''),
        'timeout' => env('CIVIL_REGISTRY_TIMEOUT', 15),
        'retry_attempts' => env('CIVIL_REGISTRY_RETRY_ATTEMPTS', 3),
        'cache_ttl' => env('CIVIL_REGISTRY_CACHE_TTL', 3600), // 1 hour
        'verify_ssl' => env('CIVIL_REGISTRY_VERIFY_SSL', true),
    ],
];
