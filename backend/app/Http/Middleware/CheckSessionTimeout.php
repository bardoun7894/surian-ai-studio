<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
use Laravel\Sanctum\PersonalAccessToken;

class CheckSessionTimeout
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $token = $request->user()->currentAccessToken();

            if ($token instanceof PersonalAccessToken) {
                // If last used more than 15 mins ago
                if ($token->last_used_at && $token->last_used_at->lt(Carbon::now()->subMinutes(15))) {
                    $token->delete();
                    return response()->json(['message' => 'Session expired due to inactivity.'], 401);
                }
            }
        }

        return $next($request);
    }
}
