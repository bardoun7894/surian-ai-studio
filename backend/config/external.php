<?php

return [
    'ai_service' => [
        'url' => env('AI_SERVICE_URL', 'http://ai-service:8000'),
        'timeout' => (int) env('AI_SERVICE_TIMEOUT', 30),
    ],

    'recaptcha' => [
        'secret_key' => env('RECAPTCHA_SECRET_KEY'),
    ],
];
