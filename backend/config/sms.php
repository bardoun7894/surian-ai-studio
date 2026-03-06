<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default SMS Provider
    |--------------------------------------------------------------------------
    |
    | This option controls the default SMS provider that is used to send
    | SMS messages. You can set this to any provider configured below.
    |
    | Supported: "twilio", "nexmo", "syria_sms", "log"
    |
    */

    'default' => env('SMS_PROVIDER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | SMS Provider Configurations
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the SMS providers used by your application.
    | Each provider has its own specific configuration requirements.
    |
    */

    'providers' => [

        'twilio' => [
            'account_sid' => env('TWILIO_ACCOUNT_SID'),
            'auth_token' => env('TWILIO_AUTH_TOKEN'),
            'from' => env('TWILIO_FROM_NUMBER'),
        ],

        'nexmo' => [
            'api_key' => env('NEXMO_API_KEY'),
            'api_secret' => env('NEXMO_API_SECRET'),
            'from' => env('NEXMO_FROM_NUMBER', 'MOE'),
        ],

        'syria_sms' => [
            'api_key' => env('SYRIA_SMS_API_KEY'),
            'sender' => env('SYRIA_SMS_SENDER', 'MOE'),
            'base_url' => env('SYRIA_SMS_BASE_URL', 'https://api.syriasms.com/send'),
        ],

        'log' => [
            // No configuration needed
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | OTP Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for One-Time Password (OTP) functionality
    |
    */

    'otp' => [
        'length' => env('OTP_LENGTH', 6),
        'expiry_minutes' => env('OTP_EXPIRY_MINUTES', 10),
        'max_attempts' => env('OTP_MAX_ATTEMPTS', 3),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limits for SMS sending to prevent abuse
    |
    */

    'rate_limit' => [
        'max_per_hour' => env('SMS_RATE_LIMIT_HOUR', 10),
        'max_per_day' => env('SMS_RATE_LIMIT_DAY', 50),
    ],

];
