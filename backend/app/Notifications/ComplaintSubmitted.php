<?php

namespace App\Notifications;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected Complaint $complaint
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
        return (new MailMessage)
            ->subject('تم استلام شكواك - ' . $this->complaint->tracking_number)
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('تم استلام شكواك بنجاح.')
            ->line('رقم التتبع: ' . $this->complaint->tracking_number)
            ->line('يمكنك استخدام هذا الرقم لمتابعة حالة شكواك.')
            ->action('تتبع الشكوى', url('/complaints/track?id=' . $this->complaint->tracking_number))
            ->line('سيتم مراجعة شكواك والرد عليها في أقرب وقت ممكن.')
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
            'type' => 'complaint_submitted',
            'complaint_id' => $this->complaint->id,
            'tracking_number' => $this->complaint->tracking_number,
            'title' => 'تم استلام شكواك',
            'message' => 'تم استلام شكواك بنجاح. رقم التتبع: ' . $this->complaint->tracking_number,
            'action_url' => '/complaints/track?id=' . $this->complaint->tracking_number,
        ];
    }
}
