<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('Accept-Language', 'ar');

        // Only allow supported locales
        if (in_array($locale, ['ar', 'en'])) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
