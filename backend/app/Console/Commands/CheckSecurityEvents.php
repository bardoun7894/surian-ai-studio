<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckSecurityEvents extends Command
{
    protected $signature = 'security:check {--hours=1 : Hours to look back for events}';

    protected $description = 'FR-46: Check for security events and send alerts';

    public function handle(NotificationService $notificationService): int
    {
        $hours = (int) $this->option('hours');
        $since = Carbon::now()->subHours($hours);

        $this->info("Checking security events since {$since->toDateTimeString()}...");

        $alerts = [];

        // Check 1: Multiple failed logins from same IP
        $failedByIp = $this->getFailedLoginsByIp($since);
        foreach ($failedByIp as $record) {
            if ($record->count >= 10) {
                $alerts[] = [
                    'type' => 'brute_force_attempt',
                    'description' => "تم اكتشاف {$record->count} محاولة تسجيل دخول فاشلة من العنوان {$record->ip}",
                    'data' => [
                        'ip' => $record->ip,
                        'count' => $record->count,
                        'period' => "{$hours} hours",
                    ],
                ];
            }
        }

        // Check 2: Multiple failed logins for same user
        $failedByUser = $this->getFailedLoginsByUser($since);
        foreach ($failedByUser as $record) {
            if ($record->count >= 5) {
                $alerts[] = [
                    'type' => 'account_attack',
                    'description' => "تم اكتشاف {$record->count} محاولة تسجيل دخول فاشلة للمستخدم رقم {$record->entity_id}",
                    'data' => [
                        'user_id' => $record->entity_id,
                        'count' => $record->count,
                        'period' => "{$hours} hours",
                    ],
                ];
            }
        }

        // Check 3: Unusual activity patterns (logins from new locations, etc.)
        $unusualLogins = $this->getUnusualLogins($since);
        foreach ($unusualLogins as $record) {
            $alerts[] = [
                'type' => 'unusual_login',
                'description' => "تسجيل دخول من موقع غير معتاد للمستخدم رقم {$record->entity_id}",
                'data' => [
                    'user_id' => $record->entity_id,
                    'ip' => $record->ip ?? 'unknown',
                ],
            ];
        }

        // Check 4: Mass data access
        $massAccess = $this->checkMassDataAccess($since);
        if ($massAccess) {
            $alerts[] = $massAccess;
        }

        // Check 5: Suggestion Spam
        $spamAlerts = $this->checkSuggestionSpam($since);
        foreach ($spamAlerts as $alert) {
            $alerts[] = $alert;
        }

        // Send alerts
        $alertsSent = 0;
        foreach ($alerts as $alert) {
            try {
                $notificationService->notifySecurityAlert(
                    $alert['type'],
                    $alert['description'],
                    $alert['data']
                );
                $alertsSent++;
                $this->warn("Alert sent: {$alert['type']}");
            } catch (\Exception $e) {
                $this->error("Failed to send alert: {$e->getMessage()}");
            }
        }

        $this->info("Security check complete. {$alertsSent} alerts sent.");

        return Command::SUCCESS;
    }

    /**
     * Get failed logins grouped by IP
     */
    protected function getFailedLoginsByIp(Carbon $since): array
    {
        return DB::select("
            SELECT
                details->>'ip' as ip,
                COUNT(*) as count
            FROM audit_logs
            WHERE action IN ('login_failed', 'login_locked_out')
                AND created_at >= ?
                AND details->>'ip' IS NOT NULL
            GROUP BY details->>'ip'
            HAVING COUNT(*) >= 5
            ORDER BY count DESC
        ", [$since]);
    }

    /**
     * Get failed logins grouped by user
     */
    protected function getFailedLoginsByUser(Carbon $since): array
    {
        return AuditLog::whereIn('action', ['login_failed', 'login_locked_out', '2fa_failed_wrong'])
            ->where('entity_type', 'user')
            ->where('created_at', '>=', $since)
            ->selectRaw('entity_id, COUNT(*) as count')
            ->groupBy('entity_id')
            ->having('count', '>=', 5)
            ->get()
            ->toArray();
    }

    /**
     * Get unusual login patterns
     */
    protected function getUnusualLogins(Carbon $since): array
    {
        // This is a simplified check - in production, you might compare against
        // known IPs/locations for each user
        return AuditLog::where('action', 'login_success')
            ->where('created_at', '>=', $since)
            ->whereRaw("details->>'new_location' = 'true'")
            ->get()
            ->toArray();
    }

    /**
     * Check for mass data access patterns
     */
    protected function checkMassDataAccess(Carbon $since): ?array
    {
        // Check if any user has accessed an unusually high number of records
        // Exclude generic 'list' actions if they are just pagination
        $highAccess = AuditLog::whereIn('action', ['view', 'export'])
            ->where('created_at', '>=', $since)
            ->selectRaw('user_id, COUNT(*) as count')
            ->groupBy('user_id')
            ->having('count', '>=', 100)
            ->first();

        if ($highAccess) {
            return [
                'type' => 'mass_data_access',
                'description' => "تم اكتشاف وصول مكثف للبيانات من المستخدم رقم {$highAccess->user_id}",
                'data' => [
                    'user_id' => $highAccess->user_id,
                    'access_count' => $highAccess->count,
                ],
            ];
        }

        return null;
    }

    /**
     * Check for suggestion spam (T-MOD-046)
     */
    protected function checkSuggestionSpam(Carbon $since): array
    {
        $alerts = [];

        // Check by IP
        // Using raw query for JSON field performance
        $spamByIp = DB::select("
            SELECT 
                details->>'ip' as ip, 
                COUNT(*) as count 
            FROM audit_logs 
            WHERE action = 'suggestion_submitted' 
                AND created_at >= ? 
                AND details->>'ip' IS NOT NULL
            GROUP BY details->>'ip' 
            HAVING COUNT(*) >= 5
        ", [$since]);

        foreach ($spamByIp as $record) {
            $alerts[] = [
                'type' => 'spam_detection',
                'description' => "مؤشر سبام: تم استلام {$record->count} مقترحات من نفس العنوان IP: {$record->ip}",
                'data' => [
                    'ip' => $record->ip,
                    'count' => $record->count,
                    'entity' => 'suggestion'
                ]
            ];
        }

        return $alerts;
    }
}
