<?php

namespace App\Notifications;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected Complaint $complaint,
        protected string $previousStatus
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        // Check user preferences for email notifications
        $preferences = $notifiable->notification_preferences ?? [];
        if ($preferences['email_notifications'] ?? true) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusLabels = [
            'new' => 'جديدة',
            'in_progress' => 'قيد المعالجة',
            'resolved' => 'تم الحل',
            'rejected' => 'مرفوضة',
            'closed' => 'مغلقة',
        ];

        $currentStatusLabel = $statusLabels[$this->complaint->status] ?? $this->complaint->status;

        return (new MailMessage)
            ->subject('تحديث حالة الشكوى - ' . $this->complaint->tracking_number)
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('تم تحديث حالة شكواك رقم: ' . $this->complaint->tracking_number)
            ->line('الحالة الجديدة: ' . $currentStatusLabel)
            ->action('عرض الشكوى', url('/complaints/track?id=' . $this->complaint->tracking_number))
            ->line('شكراً لتواصلك معنا.')
            ->salutation('وزارة التربية والتعليم');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'complaint_status_changed',
            'complaint_id' => $this->complaint->id,
            'tracking_number' => $this->complaint->tracking_number,
            'title' => 'تحديث حالة الشكوى',
            'message' => 'تم تحديث حالة شكواك رقم ' . $this->complaint->tracking_number . ' إلى: ' . $this->getStatusLabel(),
            'previous_status' => $this->previousStatus,
            'new_status' => $this->complaint->status,
            'action_url' => '/complaints/track?id=' . $this->complaint->tracking_number,
        ];
    }

    /**
     * Get the status label in Arabic.
     */
    private function getStatusLabel(): string
    {
        return match ($this->complaint->status) {
            'new' => 'جديدة',
            'in_progress' => 'قيد المعالجة',
            'resolved' => 'تم الحل',
            'rejected' => 'مرفوضة',
            'closed' => 'مغلقة',
            default => $this->complaint->status,
        };
    }
}
