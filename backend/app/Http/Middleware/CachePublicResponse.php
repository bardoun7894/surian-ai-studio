<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cache public API GET responses in Redis/file cache for faster loading.
 * Only applies to GET requests. TTL defaults to 120 seconds.
 */
class CachePublicResponse
{
    public function handle(Request $request, Closure $next, int $ttl = 120): Response
    {
        // Only cache GET requests
        if ($request->method() !== "GET") {
            return $next($request);
        }

        $cacheKey = "api_cache:" . md5($request->fullUrl());

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response()->json($cached["body"], $cached["status"])
                ->header("X-Cache", "HIT")
                ->header("Cache-Control", "public, s-maxage={$ttl}, stale-while-revalidate=300");
        }

        /** @var Response $response */
        $response = $next($request);

        // Only cache successful JSON responses
        if ($response->isSuccessful() && str_contains($response->headers->get("Content-Type", ""), "json")) {
            $body = json_decode($response->getContent(), true);
            Cache::put($cacheKey, [
                "body" => $body,
                "status" => $response->getStatusCode(),
            ], $ttl);
            $response->headers->set("X-Cache", "MISS");
            $response->headers->set("Cache-Control", "public, s-maxage={$ttl}, stale-while-revalidate=300");
        }

        return $response;
    }
}
