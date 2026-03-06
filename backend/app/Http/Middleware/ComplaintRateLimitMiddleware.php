<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
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
     * Handle an incoming request.
     *
     * FR-27: Limit complaint submissions to 3 per day per user/IP
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip rate limiting for whitelisted IPs
        if (in_array($request->ip(), self::WHITELISTED_IPS, true)) {
            return $next($request);
        }

        // Determine rate limit key (user ID or IP address)
        $key = $this->getRateLimitKey($request);

        // Check if limit exceeded (3 complaints per day)
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $availableAt = RateLimiter::availableIn($key);
            $hours = ceil($availableAt / 3600);


            $isSuggestion = str_contains($request->path(), 'suggestion');
            $label = $isSuggestion ? 'اقتراحات' : 'شكاوى';

            return response()->json([
                'error' => "تم تجاوز الحد المسموح من ال{$label} اليومية",
                'message' => "لقد تجاوزت الحد المسموح (3 {$label} في اليوم). يرجى المحاولة بعد {$hours} ساعة.",
                'retry_after' => $availableAt,
            ], 429);

        // Process the request
        $response = $next($request);

        // If complaint was successfully created, increment the counter
        if ($response->getStatusCode() === 201 || $response->getStatusCode() === 200) {
            // Hit the rate limiter (expires in 24 hours)
            RateLimiter::hit($key, 86400); // 24 hours in seconds
        }

        return $response;
    }

    /**
     * Get the rate limit key for the request
     */
    private function getRateLimitKey(Request $request): string
    {
        // Determine prefix based on route (complaints vs suggestions)
        $prefix = str_contains($request->path(), 'suggestion') ? 'suggestion_limit' : 'complaint_limit';

        // Prefer user ID for authenticated users
        if ($request->user()) {
            return $prefix . '_user_' . $request->user()->id;
        }

        // Fall back to IP address for guests
        return $prefix . '_ip_' . $request->ip();
    }
}
