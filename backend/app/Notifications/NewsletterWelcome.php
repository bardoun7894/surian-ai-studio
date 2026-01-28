<?php

namespace App\Notifications;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewsletterWelcome extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected NewsletterSubscriber $subscriber
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $unsubscribeUrl = url('/api/v1/public/newsletter/unsubscribe?email=' . urlencode($this->subscriber->email));

        return (new MailMessage)
            ->subject('مرحباً بك في النشرة البريدية - وزارة التربية والتعليم')
            ->greeting('مرحباً!')
            ->line('شكراً لاشتراكك في النشرة البريدية لوزارة التربية والتعليم.')
            ->line('ستصلك آخر الأخبار والإعلانات والقرارات الوزارية مباشرة على بريدك الإلكتروني.')
            ->action('زيارة الموقع', url('/'))
            ->line('إذا كنت ترغب في إلغاء الاشتراك، يمكنك النقر على الرابط أدناه:')
            ->line($unsubscribeUrl)
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
            'type' => 'newsletter_welcome',
            'email' => $this->subscriber->email,
        ];
    }
}
