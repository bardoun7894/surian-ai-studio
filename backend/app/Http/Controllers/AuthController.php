<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $auditService;
    protected $notificationService;

    // FR-46: Security thresholds
    protected const FAILED_LOGIN_THRESHOLD = 5;
    protected const LOCKOUT_ALERT_THRESHOLD = 3;

    public function __construct(AuditService $auditService, NotificationService $notificationService)
    {
        $this->auditService = $auditService;
        $this->notificationService = $notificationService;
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->email).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, self::FAILED_LOGIN_THRESHOLD)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            $user = User::where('email', $request->email)->first();
            if ($user) {
                $this->auditService->log($user, 'login_locked_out', 'user', $user->id);
            }

            // FR-46: Send security alert on repeated lockouts
            $this->checkAndAlertSecurityEvent($request->email, $request->ip());

            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey);
            
            if ($user) {
                $this->auditService->log($user, 'login_failed', 'user', $user->id);
            }

            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        if (! $user->is_active) {
            $this->auditService->log($user, 'login_disabled', 'user', $user->id);
            throw ValidationException::withMessages([
                'email' => ['Account is disabled.'],
            ]);
        }

        RateLimiter::clear($throttleKey);

        // Generate OTP
        $otp = (string) random_int(100000, 999999);
        $user->otp = Hash::make($otp);
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        // Send OTP (Log for now)
        Log::info("OTP for user {$user->email}: {$otp}");
        
        // In a real app, send email here:
        // Mail::to($user->email)->send(new TwoFactorCode($otp));

        $this->auditService->log($user, 'otp_sent', 'user', $user->id);

        return response()->json([
            'message' => 'OTP sent to your email.',
            'require_2fa' => true,
        ]);
    }

    public function verify2fa(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! $user->otp || ! $user->otp_expires_at) {
             $this->auditService->log($user, '2fa_failed_invalid', 'user', $user ? $user->id : null);
             throw ValidationException::withMessages([
                'otp' => ['Invalid or expired OTP.'],
            ]);
        }

        if (Carbon::now()->gt($user->otp_expires_at)) {
             $this->auditService->log($user, '2fa_failed_expired', 'user', $user->id);
             throw ValidationException::withMessages([
                'otp' => ['OTP expired.'],
            ]);
        }

        if (! Hash::check($request->otp, $user->otp)) {
             $this->auditService->log($user, '2fa_failed_wrong', 'user', $user->id);
             throw ValidationException::withMessages([
                'otp' => ['Invalid OTP.'],
            ]);
        }

        // Clear OTP
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        // Enforce Single Session: Revoke all other tokens
        $user->tokens()->delete();

        // Issue Token (Expiration updated later by Idle Timeout middleware reqs, or Sanctum default)
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->auditService->log($user, 'login_success', 'user', $user->id);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('role', 'directorate'),
        ]);
    }

    public function me(Request $request)
    {
        return $request->user()->load('role', 'directorate');
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        $this->auditService->log($user, 'logout', 'user', $user->id);

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * FR-46: Check and send security alert for suspicious activity
     */
    protected function checkAndAlertSecurityEvent(string $email, string $ip): void
    {
        $cacheKey = "security_alert_{$ip}";
        $lockoutCount = Cache::get($cacheKey, 0) + 1;
        Cache::put($cacheKey, $lockoutCount, now()->addHour());

        // Alert if this IP has caused multiple lockouts
        if ($lockoutCount >= self::LOCKOUT_ALERT_THRESHOLD) {
            try {
                $this->notificationService->notifySecurityAlert(
                    'multiple_lockouts',
                    "تم اكتشاف محاولات تسجيل دخول فاشلة متعددة من العنوان {$ip} للحساب {$email}",
                    [
                        'ip' => $ip,
                        'email' => $email,
                        'lockout_count' => $lockoutCount,
                        'timestamp' => now()->toIso8601String(),
                    ]
                );

                Log::warning("Security alert: Multiple lockouts from IP {$ip} for email {$email}");

                // Reset counter after alerting (or keep it for continued monitoring)
                Cache::put($cacheKey, 0, now()->addHour());
            } catch (\Exception $e) {
                Log::error("Failed to send security alert: {$e->getMessage()}");
            }
        }
    }
}
