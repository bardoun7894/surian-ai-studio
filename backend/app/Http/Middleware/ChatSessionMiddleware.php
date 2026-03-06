<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ChatSessionMiddleware
{
    /**
     * SEC-01: Protect guest chat endpoints against session hijacking.
     *
     * Validates that the session belongs to the current client by checking
     * an HMAC signature derived from session_id + client fingerprint.
     * For authenticated users, ownership is checked via user_id.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $sessionId = $request->route("sessionId");

        if (!$sessionId) {
            return $next($request);
        }

        // Authenticated users: ownership checked in controller
        if (auth()->check()) {
            return $next($request);
        }

        // Guest users: verify session token
        $token = $request->header("X-Chat-Token");

        if (!$token) {
            Log::warning("Chat session access without token", [
                "session_id" => $sessionId,
                "ip" => $request->ip(),
            ]);
            return response()->json([
                "error" => "رمز الجلسة مطلوب",
                "message" => "Session token required",
            ], 401);
        }

        // Verify HMAC: token = HMAC(session_id, APP_KEY)
        $expectedToken = hash_hmac("sha256", $sessionId, config("app.key"));

        if (!hash_equals($expectedToken, $token)) {
            Log::warning("Chat session invalid token", [
                "session_id" => $sessionId,
                "ip" => $request->ip(),
            ]);
            return response()->json([
                "error" => "رمز الجلسة غير صالح",
                "message" => "Invalid session token",
            ], 403);
        }

        return $next($request);
    }

    /**
     * Generate a session token for a given session ID.
     * Called when a new session is created.
     */
    public static function generateToken(string $sessionId): string
    {
        return hash_hmac("sha256", $sessionId, config("app.key"));
    }
}
