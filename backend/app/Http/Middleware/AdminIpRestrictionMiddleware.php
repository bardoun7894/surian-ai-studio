<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AdminIpRestrictionMiddleware
{
    /**
     * NFR-08: Restrict admin panel access to specific IP ranges
     *
     * Configure allowed IPs in .env:
     * ADMIN_ALLOWED_IPS=192.168.1.0/24,10.0.0.0/8,127.0.0.1
     * ADMIN_IP_RESTRICTION_ENABLED=true
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if IP restriction is enabled
        if (!\App\Models\SystemSetting::get('admin_ip_restriction_enabled', false)) {
            return $next($request);
        }

        $clientIp = $request->ip();
        $allowedIps = $this->getAllowedIps();

        // Always allow localhost in development
        if (app()->environment('local', 'development') && in_array($clientIp, ['127.0.0.1', '::1'])) {
            return $next($request);
        }

        // Check if client IP is in allowed list
        if (!$this->isIpAllowed($clientIp, $allowedIps)) {
            Log::warning('Admin access denied - IP not allowed', [
                'ip' => $clientIp,
                'path' => $request->path(),
                'user_agent' => $request->userAgent(),
            ]);

            // Notify security team
            $this->notifySecurityAlert($clientIp, $request);

            return response()->json([
                'message' => 'Access denied. Your IP address is not authorized.',
                'error' => 'ip_not_allowed',
            ], 403);
        }

        return $next($request);
    }

    /**
     * Get list of allowed IPs/ranges from settings
     */
    protected function getAllowedIps(): array
    {
        $ips = \App\Models\SystemSetting::get('admin_allowed_ips', '');

        if (empty($ips)) {
            return [];
        }

        if (is_array($ips)) {
            return $ips;
        }

        return array_map('trim', explode(',', $ips));
    }

    /**
     * Check if IP is in allowed list (supports CIDR notation)
     */
    protected function isIpAllowed(string $clientIp, array $allowedIps): bool
    {
        if (empty($allowedIps)) {
            // If no IPs configured, allow all (fail-open for usability)
            return true;
        }

        foreach ($allowedIps as $allowed) {
            if ($this->ipMatches($clientIp, $allowed)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if IP matches a specific IP or CIDR range
     */
    protected function ipMatches(string $ip, string $range): bool
    {
        // Exact match
        if ($ip === $range) {
            return true;
        }

        // CIDR range check
        if (str_contains($range, '/')) {
            return $this->ipInCidr($ip, $range);
        }

        return false;
    }

    /**
     * Check if IP is within CIDR range
     */
    protected function ipInCidr(string $ip, string $cidr): bool
    {
        list($subnet, $bits) = explode('/', $cidr);

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            // IPv4
            $ip = ip2long($ip);
            $subnet = ip2long($subnet);
            $mask = -1 << (32 - (int)$bits);
            $subnet &= $mask;
            return ($ip & $mask) === $subnet;
        }

        // IPv6 support would go here if needed
        return false;
    }

    /**
     * Notify security about blocked access attempt
     */
    protected function notifySecurityAlert(string $ip, Request $request): void
    {
        try {
            $notificationService = app(\App\Services\NotificationService::class);
            $notificationService->notifySecurityAlert(
                'admin_ip_blocked',
                "Blocked admin access attempt from IP: {$ip}",
                [
                    'ip' => $ip,
                    'path' => $request->path(),
                    'method' => $request->method(),
                    'user_agent' => $request->userAgent(),
                    'timestamp' => now()->toIso8601String(),
                ]
            );
        } catch (\Exception $e) {
            Log::error('Failed to send security alert', ['error' => $e->getMessage()]);
        }
    }
}
