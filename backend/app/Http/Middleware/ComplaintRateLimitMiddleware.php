<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
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

        // Calculate seconds remaining until midnight (calendar day reset)
        $secondsUntilMidnight = Carbon::now()->diffInSeconds(Carbon::tomorrow());

        // Check if limit exceeded (3 complaints per calendar day per user)
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $availableAt = $secondsUntilMidnight;
            $hours = ceil($availableAt / 3600);

            $isSuggestion = str_contains($request->path(), 'suggestion');
            $label = $isSuggestion ? 'اقتراحات' : 'شكاوى';

            return response()->json([
                'error' => "تم تجاوز الحد المسموح من ال{$label} اليومية",
                'message' => "لقد تجاوزت الحد المسموح (3 {$label} في اليوم). يرجى المحاولة بعد منتصف الليل.",
                'retry_after' => $availableAt,
            ], 429);
        }

        // Process the request
        $response = $next($request);

        // If complaint was successfully created, increment the counter
        if ($response->getStatusCode() === 201 || $response->getStatusCode() === 200) {
            // Hit the rate limiter (expires at midnight - calendar day reset)
            RateLimiter::hit($key, $secondsUntilMidnight);
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

        // Fall back to national_id for guest submissions (per-user limiting)
        $nationalId = $request->input('national_id');
        if ($nationalId) {
            return $prefix . '_nid_' . $nationalId;
        }

        // Last resort: fall back to IP address for anonymous guests
        return $prefix . '_ip_' . $request->ip();
    }
}
