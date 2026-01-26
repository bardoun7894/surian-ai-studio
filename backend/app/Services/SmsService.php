<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected string $provider;
    protected array $config;

    public function __construct()
    {
        $this->provider = config('sms.default', 'log');
        $this->config = config("sms.providers.{$this->provider}", []);
    }

    /**
     * Send SMS message
     */
    public function send(string $to, string $message): bool
    {
        // Normalize phone number (remove spaces, dashes, etc.)
        $to = $this->normalizePhoneNumber($to);

        // Validate phone number
        if (!$this->isValidPhoneNumber($to)) {
            Log::error("Invalid phone number: {$to}");
            return false;
        }

        // Send based on provider
        try {
            return match ($this->provider) {
                'twilio' => $this->sendViaTwilio($to, $message),
                'syria_sms' => $this->sendViaSyriaSMS($to, $message),
                'nexmo' => $this->sendViaNexmo($to, $message),
                'log' => $this->sendViaLog($to, $message),
                default => throw new \Exception("Unsupported SMS provider: {$this->provider}")
            };
        } catch (\Exception $e) {
            Log::error("SMS sending failed: {$e->getMessage()}", [
                'to' => $to,
                'provider' => $this->provider,
            ]);
            return false;
        }
    }

    /**
     * Send OTP code
     */
    public function sendOtp(string $to, string $code): bool
    {
        $message = "رمز التحقق الخاص بك من وزارة الاقتصاد والصناعة هو: {$code}\nصالح لمدة 10 دقائق.";
        return $this->send($to, $message);
    }

    /**
     * Send notification
     */
    public function sendNotification(string $to, string $title, string $body): bool
    {
        $message = "{$title}\n{$body}\n\nوزارة الاقتصاد والصناعة";
        return $this->send($to, $message);
    }

    /**
     * Send via Twilio
     */
    protected function sendViaTwilio(string $to, string $message): bool
    {
        $accountSid = $this->config['account_sid'] ?? '';
        $authToken = $this->config['auth_token'] ?? '';
        $from = $this->config['from'] ?? '';

        if (empty($accountSid) || empty($authToken) || empty($from)) {
            throw new \Exception('Twilio credentials not configured');
        }

        $response = Http::withBasicAuth($accountSid, $authToken)
            ->asForm()
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json", [
                'From' => $from,
                'To' => $to,
                'Body' => $message,
            ]);

        if ($response->successful()) {
            Log::info("SMS sent via Twilio to {$to}");
            return true;
        }

        throw new \Exception("Twilio API error: {$response->body()}");
    }

    /**
     * Send via Syria SMS (Local Provider)
     */
    protected function sendViaSyriaSMS(string $to, string $message): bool
    {
        $apiKey = $this->config['api_key'] ?? '';
        $sender = $this->config['sender'] ?? '';
        $baseUrl = $this->config['base_url'] ?? '';

        if (empty($apiKey) || empty($sender) || empty($baseUrl)) {
            throw new \Exception('Syria SMS credentials not configured');
        }

        // Example API call - adjust based on actual provider API
        $response = Http::post($baseUrl, [
            'api_key' => $apiKey,
            'sender' => $sender,
            'recipient' => $to,
            'message' => $message,
        ]);

        if ($response->successful()) {
            Log::info("SMS sent via Syria SMS to {$to}");
            return true;
        }

        throw new \Exception("Syria SMS API error: {$response->body()}");
    }

    /**
     * Send via Nexmo/Vonage
     */
    protected function sendViaNexmo(string $to, string $message): bool
    {
        $apiKey = $this->config['api_key'] ?? '';
        $apiSecret = $this->config['api_secret'] ?? '';
        $from = $this->config['from'] ?? '';

        if (empty($apiKey) || empty($apiSecret) || empty($from)) {
            throw new \Exception('Nexmo credentials not configured');
        }

        $response = Http::post('https://rest.nexmo.com/sms/json', [
            'api_key' => $apiKey,
            'api_secret' => $apiSecret,
            'from' => $from,
            'to' => $to,
            'text' => $message,
        ]);

        if ($response->successful() && $response->json('messages.0.status') === '0') {
            Log::info("SMS sent via Nexmo to {$to}");
            return true;
        }

        throw new \Exception("Nexmo API error: {$response->body()}");
    }

    /**
     * Log SMS instead of sending (for development)
     */
    protected function sendViaLog(string $to, string $message): bool
    {
        Log::channel('sms')->info("SMS to {$to}: {$message}");
        return true;
    }

    /**
     * Normalize phone number to international format
     */
    protected function normalizePhoneNumber(string $phone): string
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // Add Syrian country code if not present (assumes Syrian numbers)
        if (!str_starts_with($phone, '963')) {
            // Remove leading 0 if present
            $phone = ltrim($phone, '0');
            // Add country code
            $phone = '963' . $phone;
        }

        // Add + prefix for international format
        return '+' . $phone;
    }

    /**
     * Validate phone number format
     */
    protected function isValidPhoneNumber(string $phone): bool
    {
        // Basic validation: must start with + and be 10-15 digits
        return preg_match('/^\+[0-9]{10,15}$/', $phone) === 1;
    }

    /**
     * Generate OTP code
     */
    public static function generateOtp(int $length = 6): string
    {
        return str_pad((string) random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
    }
}
