<?php

namespace App\Notifications;

use App\Models\Suggestion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SuggestionStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected Suggestion $suggestion,
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
            'pending' => 'قيد المراجعة',
            'reviewed' => 'تمت المراجعة',
            'approved' => 'مقبول',
            'rejected' => 'مرفوض',
        ];

        $currentStatusLabel = $statusLabels[$this->suggestion->status] ?? $this->suggestion->status;

        $message = (new MailMessage)
            ->subject('تحديث حالة المقترح - ' . $this->suggestion->tracking_number)
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('تم تحديث حالة مقترحك رقم: ' . $this->suggestion->tracking_number)
            ->line('الحالة الجديدة: ' . $currentStatusLabel);

        // Add response if available
        if ($this->suggestion->admin_response) {
            $message->line('رد الإدارة: ' . $this->suggestion->admin_response);
        }

        return $message
            ->action('عرض المقترح', url('/suggestions/track?id=' . $this->suggestion->tracking_number))
            ->line('شكراً لمساهمتك.')
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
            'type' => 'suggestion_status_changed',
            'suggestion_id' => $this->suggestion->id,
            'tracking_number' => $this->suggestion->tracking_number,
            'title' => 'تحديث حالة المقترح',
            'message' => 'تم تحديث حالة مقترحك رقم ' . $this->suggestion->tracking_number . ' إلى: ' . $this->getStatusLabel(),
            'previous_status' => $this->previousStatus,
            'new_status' => $this->suggestion->status,
            'action_url' => '/suggestions/track?id=' . $this->suggestion->tracking_number,
        ];
    }

    /**
     * Get the status label in Arabic.
     */
    private function getStatusLabel(): string
    {
        return match ($this->suggestion->status) {
            'pending' => 'قيد المراجعة',
            'reviewed' => 'تمت المراجعة',
            'approved' => 'مقبول',
            'rejected' => 'مرفوض',
            default => $this->suggestion->status,
        };
    }
}
