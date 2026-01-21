<?php

namespace App\Console\Commands;

use App\Models\Complaint;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckOverdueComplaints extends Command
{
    protected $signature = 'complaints:check-overdue {--days=7 : Days threshold for overdue complaints}';

    protected $description = 'Check for overdue complaints and send reminders to staff (FR-45)';

    public function handle(NotificationService $notificationService): int
    {
        $daysThreshold = (int) $this->option('days');
        $cutoffDate = Carbon::now()->subDays($daysThreshold);

        $this->info("Checking for complaints older than {$daysThreshold} days...");

        // Find complaints that are still pending (not resolved, rejected, or closed)
        $overdueComplaints = Complaint::whereIn('status', ['new', 'received', 'in_progress'])
            ->where('created_at', '<', $cutoffDate)
            ->get();

        if ($overdueComplaints->isEmpty()) {
            $this->info('No overdue complaints found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$overdueComplaints->count()} overdue complaint(s).");

        $notifiedCount = 0;

        foreach ($overdueComplaints as $complaint) {
            $daysSinceCreated = Carbon::parse($complaint->created_at)->diffInDays(Carbon::now());

            try {
                $notificationService->notifyOverdueComplaint($complaint, $daysSinceCreated);
                $notifiedCount++;
                $this->line("Notified staff about complaint #{$complaint->tracking_number} ({$daysSinceCreated} days old)");
            } catch (\Exception $e) {
                $this->error("Failed to notify about complaint #{$complaint->tracking_number}: {$e->getMessage()}");
            }
        }

        $this->info("Sent {$notifiedCount} overdue notifications.");

        return Command::SUCCESS;
    }
}
