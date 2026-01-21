<?php

namespace App\Services;

use App\Models\Complaint;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send notification to a user
     */
    public function notify(User $user, string $type, string $title, string $body, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);
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
        $body = "تم تغيير حالة شكواك رقم {$complaint->tracking_number} من \"{$statusLabels[$oldStatus] ?? $oldStatus}\" إلى \"{$statusLabels[$newStatus] ?? $newStatus}\"";

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
}
