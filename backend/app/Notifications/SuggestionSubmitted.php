<?php

namespace App\Notifications;

use App\Models\Suggestion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SuggestionSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected Suggestion $suggestion
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
            ->subject('تم استلام مقترحك - ' . $this->suggestion->tracking_number)
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('تم استلام مقترحك بنجاح.')
            ->line('رقم التتبع: ' . $this->suggestion->tracking_number)
            ->line('يمكنك استخدام هذا الرقم لمتابعة حالة مقترحك.')
            ->action('تتبع المقترح', url('/suggestions/track?id=' . $this->suggestion->tracking_number))
            ->line('نشكرك على مساهمتك في تطوير خدماتنا.')
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
            'type' => 'suggestion_submitted',
            'suggestion_id' => $this->suggestion->id,
            'tracking_number' => $this->suggestion->tracking_number,
            'title' => 'تم استلام مقترحك',
            'message' => 'تم استلام مقترحك بنجاح. رقم التتبع: ' . $this->suggestion->tracking_number,
            'action_url' => '/suggestions/track?id=' . $this->suggestion->tracking_number,
        ];
    }
}
