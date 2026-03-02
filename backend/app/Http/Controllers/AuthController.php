<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Mail\TwoFactorCode;
use App\Mail\PasswordResetMail;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
        // Determine login method: email, phone, or national_id
        $loginField = null;
        $loginValue = null;

        if ($request->filled('email')) {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);
            $loginField = 'email';
            $loginValue = $request->email;
        } elseif ($request->filled('phone')) {
            $request->validate([
                'phone' => 'required|string',
                'password' => 'required',
            ]);
            $loginField = 'phone';
            $loginValue = $request->phone;
        } elseif ($request->filled('national_id')) {
            $request->validate([
                'national_id' => 'required|string',
                'password' => 'required',
            ]);
            $loginField = 'national_id';
            $loginValue = $request->national_id;
        } else {
            throw ValidationException::withMessages([
                'email' => [__('auth.login_identifier_required')],
            ]);
        }

        $throttleKey = Str::transliterate(Str::lower($loginValue).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, self::FAILED_LOGIN_THRESHOLD)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            $user = User::where($loginField, $loginValue)->first();
            if ($user) {
                $this->auditService->log($user, 'login_locked_out', 'user', $user->id);
            }

            // FR-46: Send security alert on repeated lockouts
            $this->checkAndAlertSecurityEvent($loginValue, $request->ip());

            throw ValidationException::withMessages([
                $loginField => [__('auth.too_many_attempts', ['seconds' => $seconds])],
            ]);
        }

        $user = User::where($loginField, $loginValue)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey);

            if ($user) {
                $this->auditService->log($user, 'login_failed', 'user', $user->id);
            }

            throw ValidationException::withMessages([
                $loginField => [__('auth.invalid_credentials')],
            ]);
        }

        if (! $user->is_active) {
            $this->auditService->log($user, 'login_disabled', 'user', $user->id);
            throw ValidationException::withMessages([
                $loginField => [__('auth.account_disabled')],
            ]);
        }

        RateLimiter::clear($throttleKey);

        // Generate OTP
        $otp = (string) random_int(100000, 999999);
        $user->otp = Hash::make($otp);
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        // Send OTP via email
        Log::info("OTP for user {$user->email}: {$otp}");
        try {
            Mail::to($user->email)->send(new TwoFactorCode($otp));
            Log::info("2FA OTP email sent successfully to {$user->email}");
        } catch (\Exception $e) {
            Log::error("Failed to send 2FA OTP email to {$user->email}: " . $e->getMessage());
            // OTP is saved in DB, user can request resend
        }

        $this->auditService->log($user, 'otp_sent', 'user', $user->id);

        return response()->json([
            'message' => __('auth.otp_sent'),
            'require_2fa' => true,
            'email' => $user->email,
        ]);
    }

    public function verify2fa(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // Allow test OTP "123456" in non-production environments (skips all OTP checks)
        $isTestOtp = !app()->environment('production') && $request->otp === '123456';

        if (! $isTestOtp) {
            if (! $user || ! $user->otp || ! $user->otp_expires_at) {
                $this->auditService->log($user, '2fa_failed_invalid', 'user', $user ? $user->id : null);
                throw ValidationException::withMessages([
                    'otp' => [__('auth.otp_invalid')],
                ]);
            }

            if (Carbon::now()->gt($user->otp_expires_at)) {
                $this->auditService->log($user, '2fa_failed_expired', 'user', $user->id);
                throw ValidationException::withMessages([
                    'otp' => [__('auth.otp_expired')],
                ]);
            }

            if (! Hash::check($request->otp, $user->otp)) {
                $this->auditService->log($user, '2fa_failed_wrong', 'user', $user->id);
                throw ValidationException::withMessages([
                    'otp' => [__('auth.otp_wrong')],
                ]);
            }
        }

        if (! $user) {
            throw ValidationException::withMessages([
                'otp' => [__('auth.otp_invalid')],
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

    public function resend2fa(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            // Don't reveal whether the email exists
            return response()->json([
                'message' => __('auth.otp_resent'),
            ]);
        }

        // Generate new OTP
        $otp = (string) random_int(100000, 999999);
        $user->otp = Hash::make($otp);
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        Log::info("OTP resent for user {$user->email}: {$otp}");
        try {
            Mail::to($user->email)->send(new TwoFactorCode($otp));
            Log::info("2FA OTP resend email sent successfully to {$user->email}");
        } catch (\Exception $e) {
            Log::error("Failed to resend 2FA OTP email to {$user->email}: " . $e->getMessage());
        }

        $this->auditService->log($user, 'otp_resent', 'user', $user->id);

        return response()->json([
            'message' => __('auth.otp_resent'),
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

        return response()->json(['message' => __('auth.logout_success')]);
    }

    /**
     * Verify user's current password (for sensitive operations like viewing audit logs)
     * POST /api/v1/auth/verify-password
     */
    public function verifyPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            $this->auditService->log($user, 'password_verify_failed', 'user', $user->id);
            return response()->json([
                'verified' => false,
                'message' => __('auth.password_incorrect'),
            ], 401);
        }

        $this->auditService->log($user, 'password_verified', 'user', $user->id);

        return response()->json([
            'verified' => true,
            'message' => __('auth.password_verified'),
        ]);
    }

    /**
     * Request password reset link
     * POST /api/v1/auth/forgot-password
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return success even if user not found (security: don't reveal if email exists)
            return response()->json([
                'message' => __('auth.password_reset_sent'),
            ]);
        }

        // Generate reset token
        $token = Str::random(64);
        $user->password_reset_token = Hash::make($token);
        $user->password_reset_expires_at = Carbon::now()->addHour();
        $user->save();

        // Build reset URL and send email
        $resetUrl = config('app.frontend_url', 'http://localhost:3000') . "/reset-password?token={$token}&email=" . urlencode($user->email);
        Log::info("Password reset link for {$user->email}: {$resetUrl}");

        // Send password reset email
        try {
            Mail::to($user->email)->send(new PasswordResetMail($resetUrl));
            Log::info("Password reset email sent to {$user->email}");
        } catch (\Exception $e) {
            Log::error("Failed to send password reset email to {$user->email}: " . $e->getMessage());
            // Still return success to not reveal email existence
        }

        $this->auditService->log($user, 'password_reset_requested', 'user', $user->id);

        return response()->json([
            'message' => __('auth.password_reset_sent'),
        ]);
    }

    /**
     * Reset password with token
     * POST /api/v1/auth/reset-password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !$user->password_reset_token || !$user->password_reset_expires_at) {
            throw ValidationException::withMessages([
                'token' => [__('auth.password_reset_invalid')],
            ]);
        }

        if (Carbon::now()->gt($user->password_reset_expires_at)) {
            throw ValidationException::withMessages([
                'token' => [__('auth.password_reset_expired')],
            ]);
        }

        if (!Hash::check($request->token, $user->password_reset_token)) {
            throw ValidationException::withMessages([
                'token' => [__('auth.password_reset_invalid')],
            ]);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->password_reset_token = null;
        $user->password_reset_expires_at = null;
        $user->save();

        // Revoke all tokens (force re-login)
        $user->tokens()->delete();

        $this->auditService->log($user, 'password_reset_completed', 'user', $user->id);

        return response()->json([
            'message' => __('auth.password_reset_success'),
        ]);
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
