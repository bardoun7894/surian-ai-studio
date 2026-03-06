<?php

namespace App\Notifications;

use App\Models\Complaint;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewComplaintAssigned extends Notification implements ShouldQueue
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
        $priorityLabels = [
            'low' => 'منخفضة',
            'medium' => 'متوسطة',
            'high' => 'عالية',
            'urgent' => 'عاجلة',
        ];

        $priorityLabel = $priorityLabels[$this->complaint->priority] ?? $this->complaint->priority;

        return (new MailMessage)
            ->subject('شكوى جديدة تم تعيينها لك - ' . $this->complaint->tracking_number)
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('تم تعيين شكوى جديدة لك للمتابعة.')
            ->line('رقم التتبع: ' . $this->complaint->tracking_number)
            ->line('الأولوية: ' . $priorityLabel)
            ->line('العنوان: ' . ($this->complaint->title ?? 'بدون عنوان'))
            ->action('عرض الشكوى', url('/admin/complaints/' . $this->complaint->id))
            ->line('يرجى مراجعة الشكوى والرد عليها في أقرب وقت.')
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
            'type' => 'new_complaint_assigned',
            'complaint_id' => $this->complaint->id,
            'tracking_number' => $this->complaint->tracking_number,
            'title' => 'شكوى جديدة',
            'message' => 'تم تعيين شكوى جديدة لك: ' . $this->complaint->tracking_number,
            'priority' => $this->complaint->priority,
            'action_url' => '/admin/complaints/' . $this->complaint->id,
        ];
    }
}
