<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
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
     * Limit suggestion submissions to 3 per day per user/national_id/IP.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (in_array($request->ip(), self::WHITELISTED_IPS, true)) {
            return $next($request);
        }

        $key = $this->getRateLimitKey($request);

        // Calculate seconds remaining until midnight (calendar day reset)
        $secondsUntilMidnight = Carbon::now()->diffInSeconds(Carbon::tomorrow());

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $availableAt = $secondsUntilMidnight;

            return response()->json([
                'error' => 'تم تجاوز الحد المسموح من المقترحات اليومية',
                'message' => "لقد تجاوزت الحد المسموح (3 مقترحات في اليوم). يرجى المحاولة بعد منتصف الليل.",
                'retry_after' => $availableAt,
            ], 429);
        }

        $response = $next($request);

        if ($response->getStatusCode() === 201 || $response->getStatusCode() === 200) {
            // Hit the rate limiter (expires at midnight - calendar day reset)
            RateLimiter::hit($key, $secondsUntilMidnight);
        }

        return $response;
    }

    private function getRateLimitKey(Request $request): string
    {
        if ($request->user()) {
            return 'suggestion_limit_user_' . $request->user()->id;
        }

        $nationalId = $request->input('national_id');
        if ($nationalId) {
            return 'suggestion_limit_nid_' . $nationalId;
        }

        return 'suggestion_limit_ip_' . $request->ip();
    }
}
