<?php

namespace App\Console\Commands;

use App\Models\Complaint;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * T-SRS2-12, T-SRS2-13: Escalate complaints that are inactive for too long
 * FR-68: Escalation process for inactive complaints
 * FR-69: Set escalation thresholds (5, 10 days)
 */
class EscalateOldComplaints extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'complaints:escalate
        {--first-warning=5 : Days before first escalation warning}
        {--final-escalation=10 : Days before final escalation}
        {--dry-run : Run without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Escalate complaints that have been inactive for too long (FR-68, FR-69)';

    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $firstWarningDays = (int) $this->option('first-warning');
        $finalEscalationDays = (int) $this->option('final-escalation');
        $dryRun = $this->option('dry-run');

        $this->info("Checking for complaints to escalate...");
        $this->info("First warning threshold: {$firstWarningDays} days");
        $this->info("Final escalation threshold: {$finalEscalationDays} days");

        if ($dryRun) {
            $this->warn("DRY RUN - No changes will be made");
        }

        // Get complaints that need first warning (5 days)
        $firstWarningComplaints = $this->getComplaintsForFirstWarning($firstWarningDays);
        $this->processFirstWarning($firstWarningComplaints, $dryRun);

        // Get complaints that need final escalation (10 days)
        $finalEscalationComplaints = $this->getComplaintsForFinalEscalation($finalEscalationDays);
        $this->processFinalEscalation($finalEscalationComplaints, $dryRun);

        $this->info("Escalation check completed.");
        $this->info("First warnings sent: " . count($firstWarningComplaints));
        $this->info("Final escalations: " . count($finalEscalationComplaints));

        return Command::SUCCESS;
    }

    /**
     * Get complaints that need first warning
     * - Status: new, received, in_progress
     * - Last activity >= firstWarningDays
     * - Not snoozed
     * - Not already warned
     */
    protected function getComplaintsForFirstWarning(int $days): \Illuminate\Support\Collection
    {
        return Complaint::whereIn('status', ['new', 'received', 'in_progress'])
            ->notSnoozed()
            ->where(function ($query) use ($days) {
                // Check last activity (response or update)
                $query->where('updated_at', '<=', now()->subDays($days));
            })
            ->whereNull('escalation_level')
            ->orWhere('escalation_level', '<', 1)
            ->get();
    }

    /**
     * Get complaints that need final escalation
     * - Status: new, received, in_progress
     * - Last activity >= finalEscalationDays
     * - Not snoozed
     * - Already received first warning
     */
    protected function getComplaintsForFinalEscalation(int $days): \Illuminate\Support\Collection
    {
        return Complaint::whereIn('status', ['new', 'received', 'in_progress'])
            ->notSnoozed()
            ->where('updated_at', '<=', now()->subDays($days))
            ->where('escalation_level', '>=', 1)
            ->where('escalation_level', '<', 2)
            ->get();
    }

    /**
     * Process first warning for complaints
     */
    protected function processFirstWarning($complaints, bool $dryRun): void
    {
        foreach ($complaints as $complaint) {
            $this->line("First warning: {$complaint->tracking_number} (inactive since {$complaint->updated_at})");

            if (!$dryRun) {
                // Update escalation level
                $complaint->escalation_level = 1;
                $complaint->first_warning_at = now();
                $complaint->save();

                // Send notification to directorate staff
                try {
                    $this->notificationService->notifyEscalation(
                        $complaint,
                        'first_warning',
                        "Complaint {$complaint->tracking_number} has been inactive for more than 5 days"
                    );
                } catch (\Exception $e) {
                    Log::error("Failed to send escalation notification: {$e->getMessage()}");
                }
            }
        }
    }

    /**
     * Process final escalation for complaints
     */
    protected function processFinalEscalation($complaints, bool $dryRun): void
    {
        foreach ($complaints as $complaint) {
            $this->line("Final escalation: {$complaint->tracking_number} (inactive since {$complaint->updated_at})");

            if (!$dryRun) {
                // Update escalation level
                $complaint->escalation_level = 2;
                $complaint->final_escalation_at = now();
                $complaint->priority = 'high'; // Auto-escalate priority
                $complaint->save();

                // Send notification to directorate manager and admin
                try {
                    $this->notificationService->notifyEscalation(
                        $complaint,
                        'final_escalation',
                        "URGENT: Complaint {$complaint->tracking_number} has been inactive for more than 10 days"
                    );
                } catch (\Exception $e) {
                    Log::error("Failed to send escalation notification: {$e->getMessage()}");
                }
            }
        }
    }
}
