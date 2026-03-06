<?php

return [

    /*
    |--------------------------------------------------------------------------
    | WhatsApp Business API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for WhatsApp Business API integration (FR-53)
    | This allows users to interact with the chatbot via WhatsApp
    |
    */

    'enabled' => env('WHATSAPP_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | WhatsApp Business API Credentials
    |--------------------------------------------------------------------------
    |
    | These credentials are obtained from Meta for Developers
    | (https://developers.facebook.com/)
    |
    */

    'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
    'access_token' => env('WHATSAPP_ACCESS_TOKEN'),
    'business_account_id' => env('WHATSAPP_BUSINESS_ACCOUNT_ID'),

    /*
    |--------------------------------------------------------------------------
    | Webhook Configuration
    |--------------------------------------------------------------------------
    |
    | Webhook settings for receiving incoming WhatsApp messages
    |
    */

    'verify_token' => env('WHATSAPP_VERIFY_TOKEN', 'moe_whatsapp_webhook_2026'),
    'webhook_url' => env('WHATSAPP_WEBHOOK_URL', '/api/v1/webhooks/whatsapp'),

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    */

    'api_url' => env('WHATSAPP_API_URL', 'https://graph.facebook.com/v18.0'),
    'api_version' => env('WHATSAPP_API_VERSION', 'v18.0'),

    /*
    |--------------------------------------------------------------------------
    | Message Templates
    |--------------------------------------------------------------------------
    |
    | Pre-approved message templates for notifications
    | Templates must be created and approved in Meta Business Manager
    |
    */

    'templates' => [
        'complaint_status_update' => 'complaint_status_update',
        'otp_verification' => 'otp_verification',
        'welcome_message' => 'welcome_message',
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Rate limits for WhatsApp messages to prevent spam
    |
    */

    'rate_limit' => [
        'messages_per_minute' => env('WHATSAPP_RATE_LIMIT_MINUTE', 60),
        'messages_per_day' => env('WHATSAPP_RATE_LIMIT_DAY', 1000),
    ],

];
