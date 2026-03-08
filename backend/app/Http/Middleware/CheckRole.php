<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * User passes if they have ANY of the listed permissions (OR logic).
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        if (! $request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصادق. يرجى تسجيل الدخول.',
                'message_en' => 'Unauthenticated. Please log in.',
                'error_code' => 'UNAUTHENTICATED',
            ], 401);
        }

        foreach ($permissions as $permission) {
            if ($request->user()->hasPermission($permission)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'غير مصرح لك بتنفيذ هذا الإجراء.',
            'message_en' => 'Unauthorized action.',
            'error_code' => 'FORBIDDEN',
        ], 403);
    }
}
