<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Telegram Bot Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Telegram Bot API integration (FR-53)
    | This allows users to interact with the chatbot via Telegram
    |
    */

    'enabled' => env('TELEGRAM_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Telegram Bot Credentials
    |--------------------------------------------------------------------------
    |
    | Bot Token is obtained from @BotFather on Telegram
    |
    */

    'bot_token' => env('TELEGRAM_BOT_TOKEN'),
    'bot_username' => env('TELEGRAM_BOT_USERNAME'),

    /*
    |--------------------------------------------------------------------------
    | Webhook Configuration
    |--------------------------------------------------------------------------
    */

    'webhook_secret' => env('TELEGRAM_WEBHOOK_SECRET', 'moe_telegram_webhook_2026'),
    'webhook_url' => env('TELEGRAM_WEBHOOK_URL', '/api/v1/webhooks/telegram'),

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    */

    'api_url' => env('TELEGRAM_API_URL', 'https://api.telegram.org'),

    /*
    |--------------------------------------------------------------------------
    | Bot Commands
    |--------------------------------------------------------------------------
    |
    | Commands available in the bot
    |
    */

    'commands' => [
        'start' => 'بدء المحادثة',
        'help' => 'عرض المساعدة',
        'track' => 'متابعة شكوى',
        'contact' => 'معلومات التواصل',
    ],

];
