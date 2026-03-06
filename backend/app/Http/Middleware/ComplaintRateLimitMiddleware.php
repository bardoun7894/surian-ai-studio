<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;

class ComplaintRateLimitMiddleware
{
    /**
     * IPs exempt from the daily complaint rate limit.
     */
    private const WHITELISTED_IPS = [
        '196.70.75.216',
    ];

    /**
     * Maximum submissions per calendar day per user/IP.
     */
    private const MAX_PER_DAY = 3;

    /**
     * Handle an incoming request.
     *
     * Bug #315 fix: Per-user/per-IP rate limiting that resets at midnight (calendar day).
     * Previously this was global and used a 24h sliding window from last submission.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip rate limiting for whitelisted IPs
        if (in_array($request->ip(), self::WHITELISTED_IPS, true)) {
            return $next($request);
        }

        // Determine rate limit key (user ID or IP address)
        $key = $this->getRateLimitKey($request);
        $count = (int) Cache::get($key, 0);

        // Check if limit exceeded (3 complaints per calendar day)
        if ($count >= self::MAX_PER_DAY) {
            $secondsUntilMidnight = Carbon::now()->diffInSeconds(Carbon::tomorrow());
            $hours = ceil($secondsUntilMidnight / 3600);

            // Determine locale from Accept-Language header
            $locale = str_starts_with($request->header('Accept-Language', 'ar'), 'en') ? 'en' : 'ar';

            $errorMessages = [
                'ar' => [
                    'error' => 'تم تجاوز الحد المسموح من الشكاوى اليومية',
                    'message' => "لقد تجاوزت الحد المسموح (" . self::MAX_PER_DAY . " شكاوى في اليوم). يرجى المحاولة بعد {$hours} ساعة (بعد منتصف الليل).",
                ],
                'en' => [
                    'error' => 'Daily complaint limit exceeded',
                    'message' => "You have exceeded the daily limit (" . self::MAX_PER_DAY . " complaints per day). Please try again in {$hours} hour(s) (after midnight).",
                ],
            ];

            return response()->json([
                'error' => $errorMessages[$locale]['error'],
                'error_ar' => $errorMessages['ar']['error'],
                'error_en' => $errorMessages['en']['error'],
                'message' => $errorMessages[$locale]['message'],
                'message_ar' => $errorMessages['ar']['message'],
                'message_en' => $errorMessages['en']['message'],
                'retry_after' => $secondsUntilMidnight,
            ], 429);
        }

        // Process the request
        $response = $next($request);

        // If complaint was successfully created, increment the counter
        if ($response->getStatusCode() === 201 || $response->getStatusCode() === 200) {
            $secondsUntilMidnight = Carbon::now()->diffInSeconds(Carbon::tomorrow());
            Cache::put($key, $count + 1, $secondsUntilMidnight);
        }

        return $response;
    }

    /**
     * Get the rate limit key for the request.
     * Uses user_id for authenticated users, national_id if provided, or IP for guests.
     * Includes today's date to ensure automatic midnight reset.
     */
    private function getRateLimitKey(Request $request): string
    {
        $today = Carbon::today()->toDateString(); // e.g. 2026-03-05

        // Prefer user ID for authenticated users
        if ($request->user()) {
            return "complaint_daily_{$today}_user_" . $request->user()->id;
        }

        // Use national_id if provided (for guest submissions)
        $nationalId = $request->input('national_id');
        if ($nationalId) {
            return "complaint_daily_{$today}_nid_{$nationalId}";
        }

        // Fall back to IP address for anonymous guests
        return "complaint_daily_{$today}_ip_" . $request->ip();
    }
}
