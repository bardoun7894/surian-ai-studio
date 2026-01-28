<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SystemNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected string $title,
        protected string $message,
        protected ?string $actionUrl = null,
        protected ?string $actionText = null,
        protected bool $sendEmail = false
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($this->sendEmail) {
            // Check user preferences for email notifications
            $preferences = $notifiable->notification_preferences ?? [];
            if ($preferences['email_notifications'] ?? true) {
                $channels[] = 'mail';
            }
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject($this->title)
            ->greeting('مرحباً ' . $notifiable->name)
            ->line($this->message);

        if ($this->actionUrl && $this->actionText) {
            $mail->action($this->actionText, url($this->actionUrl));
        }

        return $mail->salutation('وزارة التربية والتعليم');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'system_notification',
            'title' => $this->title,
            'message' => $this->message,
            'action_url' => $this->actionUrl,
        ];
    }
}
