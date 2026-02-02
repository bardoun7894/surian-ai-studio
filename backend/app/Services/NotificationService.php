<?php

namespace App\Services;

use App\Mail\NotificationMail;
use App\Models\Complaint;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Send notification to a user (both in-app and email if enabled)
     */
    public function notify(User $user, string $type, string $title, string $body, array $data = [], ?string $actionUrl = null): Notification
    {
        // Create in-app notification
        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);

        // Send email notification if user has email and has email notifications enabled
        $this->sendEmailNotification($user, $type, $title, $body, $data, $actionUrl);

        return $notification;
    }

    /**
     * Send email notification based on user preferences
     */
    protected function sendEmailNotification(User $user, string $type, string $title, string $body, array $data, ?string $actionUrl): void
    {
        // Check if user has email
        if (empty($user->email)) {
            return;
        }

        // Check if user has email notifications enabled (default to true if not set)
        $preferences = $user->notification_preferences ?? [];
        $emailEnabled = $preferences['email_enabled'] ?? true;

        if (!$emailEnabled) {
            Log::info("Email notifications disabled for user #{$user->id}");
            return;
        }

        // Check if this notification type should send emails
        $emailTypes = $preferences['email_types'] ?? ['all'];

        if (!in_array('all', $emailTypes) && !in_array($type, $emailTypes)) {
            Log::info("Email notification type '{$type}' disabled for user #{$user->id}");
            return;
        }

        try {
            // Queue email for async delivery
            Mail::to($user->email)->queue(new NotificationMail(
                $title,
                $body,
                $data,
                $actionUrl
            ));

            Log::info("Email notification queued for {$user->email} for type: {$type}");
        } catch (\Exception $e) {
            Log::error("Failed to queue email notification for {$user->email}: {$e->getMessage()}");
        }
    }

    /**
     * Send notification to multiple users
     */
    public function notifyMany(array $users, string $type, string $title, string $body, array $data = []): array
    {
        $notifications = [];

        foreach ($users as $user) {
            if ($user instanceof User) {
                $notifications[] = $this->notify($user, $type, $title, $body, $data);
            }
        }

        return $notifications;
    }

    /**
     * FR-44: Notify staff when a new complaint is submitted
     */
    public function notifyNewComplaint(Complaint $complaint): void
    {
        // Get staff users in the same directorate
        $staffUsers = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['staff', 'admin.general', 'admin.super']);
        })
        ->where(function ($query) use ($complaint) {
            $query->where('directorate_id', $complaint->directorate_id)
                  ->orWhereNull('directorate_id'); // Admins see all
        })
        ->get();

        if ($staffUsers->isEmpty()) {
            Log::warning("No staff users found for directorate #{$complaint->directorate_id}");
            return;
        }

        $title = 'شكوى جديدة';
        $body = "تم استلام شكوى جديدة برقم {$complaint->tracking_number}";

        $data = [
            'complaint_id' => $complaint->id,
            'tracking_number' => $complaint->tracking_number,
            'directorate_id' => $complaint->directorate_id,
            'priority' => $complaint->priority,
        ];

        $this->notifyMany($staffUsers->all(), Notification::TYPE_COMPLAINT_NEW, $title, $body, $data);

        Log::info("Notified {$staffUsers->count()} staff members about new complaint #{$complaint->tracking_number}");
    }

    /**
     * FR-48: Notify citizen when complaint status changes
     */
    public function notifyStatusChange(Complaint $complaint, string $oldStatus, string $newStatus): void
    {
        $user = $complaint->user;

        if (!$user) {
            Log::info("Cannot notify status change - complaint #{$complaint->tracking_number} has no user");
            return;
        }

        $statusLabels = [
            'new' => 'جديدة',
            'received' => 'مستلمة',
            'in_progress' => 'قيد المعالجة',
            'resolved' => 'تم الحل',
            'rejected' => 'مرفوضة',
            'closed' => 'مغلقة',
        ];

        $title = 'تحديث حالة الشكوى';
        $oldLabel = $statusLabels[$oldStatus] ?? $oldStatus;
        $newLabel = $statusLabels[$newStatus] ?? $newStatus;
        $body = "تم تغيير حالة شكواك رقم {$complaint->tracking_number} من \"{$oldLabel}\" إلى \"{$newLabel}\"";

        $data = [
            'complaint_id' => $complaint->id,
            'tracking_number' => $complaint->tracking_number,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
        ];

        $this->notify($user, Notification::TYPE_COMPLAINT_STATUS, $title, $body, $data);

        Log::info("Notified user #{$user->id} about status change for complaint #{$complaint->tracking_number}");
    }

    /**
     * Notify citizen when a response is added to their complaint
     */
    public function notifyComplaintResponse(Complaint $complaint, string $responsePreview): void
    {
        $user = $complaint->user;

        if (!$user) {
            return;
        }

        $title = 'رد جديد على شكواك';
        $body = "تم إضافة رد على شكواك رقم {$complaint->tracking_number}";

        $data = [
            'complaint_id' => $complaint->id,
            'tracking_number' => $complaint->tracking_number,
            'response_preview' => mb_substr($responsePreview, 0, 100),
        ];

        $this->notify($user, Notification::TYPE_COMPLAINT_RESPONSE, $title, $body, $data);
    }

    /**
     * FR-45: Notify staff about overdue complaints
     */
    public function notifyOverdueComplaint(Complaint $complaint, int $daysSinceCreated): void
    {
        $staffUsers = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['staff', 'admin.general', 'admin.super']);
        })
        ->where(function ($query) use ($complaint) {
            $query->where('directorate_id', $complaint->directorate_id)
                  ->orWhereNull('directorate_id');
        })
        ->get();

        $title = 'شكوى متأخرة';
        $body = "الشكوى رقم {$complaint->tracking_number} متأخرة منذ {$daysSinceCreated} أيام";

        $data = [
            'complaint_id' => $complaint->id,
            'tracking_number' => $complaint->tracking_number,
            'days_overdue' => $daysSinceCreated,
        ];

        $this->notifyMany($staffUsers->all(), Notification::TYPE_COMPLAINT_OVERDUE, $title, $body, $data);
    }

    /**
     * FR-46: Security alert notification
     */
    public function notifySecurityAlert(string $alertType, string $description, array $data = []): void
    {
        // Notify all admins
        $admins = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['admin.general', 'admin.super']);
        })->get();

        $title = 'تنبيه أمني';
        $body = $description;

        $data['alert_type'] = $alertType;

        $this->notifyMany($admins->all(), Notification::TYPE_SECURITY_ALERT, $title, $body, $data);

        Log::warning("Security alert: {$alertType}", $data);
    }

    /**
     * Get unread notifications count for a user
     */
    public function getUnreadCount(User $user): int
    {
        return Notification::where('user_id', $user->id)->unread()->count();
    }

    /**
     * Get notifications for a user
     */
    public function getUserNotifications(User $user, int $limit = 20): \Illuminate\Database\Eloquent\Collection
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->unread()
            ->update(['is_read' => true]);
    }

    /**
     * FR-68, FR-69: Notify about complaint escalation
     * T-SRS2-12, T-SRS2-13: Escalation notifications
     */
    public function notifyEscalation(Complaint $complaint, string $level, string $message): void
    {
        // Get staff users in the same directorate
        $roles = $level === 'final_escalation'
            ? ['admin.general', 'admin.super'] // Final escalation goes to admins
            : ['staff', 'admin.general', 'admin.super'];

        $staffUsers = User::whereHas('role', function ($query) use ($roles) {
            $query->whereIn('name', $roles);
        })
        ->where(function ($query) use ($complaint) {
            $query->where('directorate_id', $complaint->directorate_id)
                  ->orWhereNull('directorate_id');
        })
        ->get();

        $title = $level === 'final_escalation' ? 'تصعيد نهائي - شكوى متأخرة' : 'تنبيه - شكوى متأخرة';

        $data = [
            'complaint_id' => $complaint->id,
            'tracking_number' => $complaint->tracking_number,
            'escalation_level' => $level,
            'directorate_id' => $complaint->directorate_id,
        ];

        $type = $level === 'final_escalation'
            ? Notification::TYPE_COMPLAINT_OVERDUE
            : Notification::TYPE_COMPLAINT_OVERDUE;

        $this->notifyMany($staffUsers->all(), $type, $title, $message, $data);

        Log::info("Escalation notification ({$level}) sent for complaint #{$complaint->tracking_number}");
    }

    /**
     * FR-70: Notify staff when a new suggestion is submitted
     */
    public function notifyNewSuggestion(\App\Models\Suggestion $suggestion): void
    {
        // Get staff users (admins see all suggestions)
        $staffUsers = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['staff', 'admin.general', 'admin.super']);
        })->get();

        if ($staffUsers->isEmpty()) {
            Log::warning("No staff users found for new suggestion notification");
            return;
        }

        $title = 'اقتراح جديد';
        $body = "تم استلام اقتراح جديد برقم {$suggestion->tracking_number} من {$suggestion->name}";

        $data = [
            'suggestion_id' => $suggestion->id,
            'tracking_number' => $suggestion->tracking_number,
            'name' => $suggestion->name,
        ];

        $this->notifyMany($staffUsers->all(), 'suggestion_new', $title, $body, $data);

        Log::info("Notified {$staffUsers->count()} staff members about new suggestion #{$suggestion->tracking_number}");
    }

    /**
     * T-SRS2-11: Notify suggestion submitter about status change
     * FR-55: Notification when suggestion status changes
     */
    public function notifySuggestionStatusChange(\App\Models\Suggestion $suggestion, string $oldStatus, string $newStatus): void
    {
        // Suggestions may not have a user (public submissions)
        // Try to notify via email if available
        if (!$suggestion->email) {
            Log::info("Cannot notify suggestion status change - no email for suggestion #{$suggestion->tracking_number}");
            return;
        }

        $statusLabels = [
            'pending' => 'قيد المراجعة',
            'reviewed' => 'تمت المراجعة',
            'approved' => 'تمت الموافقة',
            'rejected' => 'مرفوض',
        ];

        $oldLabel = $statusLabels[$oldStatus] ?? $oldStatus;
        $newLabel = $statusLabels[$newStatus] ?? $newStatus;

        // If there's a user associated, create notification
        if ($suggestion->user_id) {
            $user = User::find($suggestion->user_id);
            if ($user) {
                $title = 'تحديث حالة الاقتراح';
                $body = "تم تغيير حالة اقتراحك رقم {$suggestion->tracking_number} من \"{$oldLabel}\" إلى \"{$newLabel}\"";

                $data = [
                    'suggestion_id' => $suggestion->id,
                    'tracking_number' => $suggestion->tracking_number,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'response' => $suggestion->response,
                ];

                $this->notify($user, 'suggestion_status', $title, $body, $data);
            }
        }

        // Queue email notification to suggestion email (even for anonymous submissions)
        if ($suggestion->email) {
            try {
                $title = 'تحديث حالة الاقتراح';
                $body = "تم تغيير حالة اقتراحك رقم {$suggestion->tracking_number} من \"{$oldLabel}\" إلى \"{$newLabel}\"";
                $actionUrl = url('/suggestions/track?id=' . $suggestion->tracking_number);

                Mail::to($suggestion->email)->queue(new NotificationMail(
                    $title,
                    $body,
                    [
                        'tracking_number' => $suggestion->tracking_number,
                        'new_status' => $newStatus,
                        'response' => $suggestion->response,
                    ],
                    $actionUrl
                ));
                Log::info("Suggestion status email queued for {$suggestion->email}");
            } catch (\Exception $e) {
                Log::error("Failed to queue suggestion status email for {$suggestion->email}: {$e->getMessage()}");
            }
        }

        Log::info("Suggestion #{$suggestion->tracking_number} status changed from {$oldStatus} to {$newStatus}");
    }
}
