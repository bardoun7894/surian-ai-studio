<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RecaptchaService
{
    protected $secretKey;
    protected $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    public function __construct()
    {
        $this->secretKey = config('external.recaptcha.secret_key');
    }

    public function verify($token, $ip = null): bool
    {
        if (empty($this->secretKey)) {
            // If no key configured (e.g. dev), bypass
            return true;
        }

        $response = Http::asForm()->post($this->verifyUrl, [
            'secret' => $this->secretKey,
            'response' => $token,
            'remoteip' => $ip,
        ]);

        $body = $response->json();

        return $body['success'] ?? false;
    }
}
