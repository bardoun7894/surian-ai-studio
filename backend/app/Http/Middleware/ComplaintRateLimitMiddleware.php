<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
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
     * FR-27: Limit complaint submissions to 3 per day per user/national_id/IP
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

            return response()->json([
                'error' => 'تم تجاوز الحد المسموح من الشكاوى اليومية',
                'message' => "لقد تجاوزت الحد المسموح (3 شكاوى في اليوم). يرجى المحاولة بعد {$hours} ساعة.",
                'retry_after' => $availableAt,
            ], 429);
        }

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
     * Get the rate limit key for the request.
     *
     * Priority: authenticated user_id > guest national_id > IP address.
     * This ensures per-user limits, not global limits.
     */
    private function getRateLimitKey(Request $request): string
    {
        // Prefer user ID for authenticated users
        if ($request->user()) {
            return 'complaint_limit_user_' . $request->user()->id;
        }

        // Use national_id for identified guests (from form data or guest token)
        $nationalId = $request->input('national_id');
        if ($nationalId) {
            return 'complaint_limit_nid_' . $nationalId;
        }

        // Fall back to IP address for anonymous guests
        return 'complaint_limit_ip_' . $request->ip();
    }
}
