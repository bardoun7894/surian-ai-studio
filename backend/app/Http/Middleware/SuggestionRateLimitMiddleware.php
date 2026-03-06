<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;

class SuggestionRateLimitMiddleware
{
    /**
     * IPs exempt from the daily suggestion rate limit.
     */
    private const WHITELISTED_IPS = [
        '196.70.75.216',
    ];

    /**
     * Maximum suggestions per calendar day per user/IP.
     */
    private const MAX_PER_DAY = 3;

    /**
     * Handle an incoming request.
     *
     * Bug #315 fix: Per-user/per-IP rate limiting for suggestions that resets at midnight.
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

        // Check if limit exceeded
        if ($count >= self::MAX_PER_DAY) {
            $secondsUntilMidnight = Carbon::now()->diffInSeconds(Carbon::tomorrow());
            $hours = ceil($secondsUntilMidnight / 3600);

            // Determine locale from Accept-Language header
            $locale = str_starts_with($request->header('Accept-Language', 'ar'), 'en') ? 'en' : 'ar';

            $errorMessages = [
                'ar' => [
                    'error' => 'تم تجاوز الحد المسموح من المقترحات اليومية',
                    'message' => "لقد تجاوزت الحد المسموح (" . self::MAX_PER_DAY . " مقترحات في اليوم). يرجى المحاولة بعد {$hours} ساعة (بعد منتصف الليل).",
                ],
                'en' => [
                    'error' => 'Daily suggestion limit exceeded',
                    'message' => "You have exceeded the daily limit (" . self::MAX_PER_DAY . " suggestions per day). Please try again in {$hours} hour(s) (after midnight).",
                ],
            ];

            return response()->json([
                'success' => false,
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

        // If suggestion was successfully created, increment the counter
        if ($response->getStatusCode() === 201 || $response->getStatusCode() === 200) {
            $responseData = json_decode($response->getContent(), true);
            // Only count successful submissions
            if (isset($responseData['success']) && $responseData['success'] === true) {
                $secondsUntilMidnight = Carbon::now()->diffInSeconds(Carbon::tomorrow());
                Cache::put($key, $count + 1, $secondsUntilMidnight);
            }
        }

        return $response;
    }

    /**
     * Get the rate limit key for the request.
     * Uses user_id for authenticated users, national_id if provided, or IP for guests.
     * Includes today's date for automatic midnight reset.
     */
    private function getRateLimitKey(Request $request): string
    {
        $today = Carbon::today()->toDateString();

        if ($request->user()) {
            return "suggestion_daily_{$today}_user_" . $request->user()->id;
        }

        $nationalId = $request->input('national_id');
        if ($nationalId) {
            return "suggestion_daily_{$today}_nid_{$nationalId}";
        }

        return "suggestion_daily_{$today}_ip_" . $request->ip();
    }
}
