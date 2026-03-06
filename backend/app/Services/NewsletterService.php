<?php

namespace App\Services;

use App\Models\NewsletterSubscriber;
use App\Notifications\NewsletterWelcome;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Message;

class NewsletterService
{
    /**
     * Subscribe an email to the newsletter.
     */
    public function subscribe(string $email): NewsletterSubscriber
    {
        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $email],
            [
                'status' => 'active',
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]
        );

        // Send welcome email
        try {
            $subscriber->notify(new NewsletterWelcome($subscriber));
        } catch (\Exception $e) {
            Log::warning('Failed to send newsletter welcome email', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);
        }

        return $subscriber;
    }

    /**
     * Unsubscribe an email from the newsletter.
     */
    public function unsubscribe(string $email): bool
    {
        $subscriber = NewsletterSubscriber::where('email', $email)->first();

        if (!$subscriber) {
            return false;
        }

        $subscriber->update([
            'status' => 'unsubscribed',
            'unsubscribed_at' => now(),
        ]);

        return true;
    }

    /**
     * Send a newsletter to all active subscribers.
     */
    public function sendNewsletter(string $subject, string $content, ?string $htmlContent = null): array
    {
        $subscribers = NewsletterSubscriber::where('status', 'active')->get();
        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($subscribers as $subscriber) {
            try {
                Mail::send([], [], function (Message $message) use ($subscriber, $subject, $content, $htmlContent) {
                    $message->to($subscriber->email)
                        ->subject($subject);

                    if ($htmlContent) {
                        $message->html($this->wrapInTemplate($htmlContent, $subscriber->email));
                    } else {
                        $message->html($this->wrapInTemplate(nl2br(e($content)), $subscriber->email));
                    }
                });

                $sent++;
            } catch (\Exception $e) {
                $failed++;
                $errors[] = [
                    'email' => $subscriber->email,
                    'error' => $e->getMessage(),
                ];

                Log::warning('Failed to send newsletter', [
                    'email' => $subscriber->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return [
            'total' => $subscribers->count(),
            'sent' => $sent,
            'failed' => $failed,
            'errors' => $errors,
        ];
    }

    /**
     * Wrap content in email template.
     */
    protected function wrapInTemplate(string $content, string $email): string
    {
        $unsubscribeUrl = url('/api/v1/public/newsletter/unsubscribe?email=' . urlencode($email));

        return <<<HTML
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8fafc; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        .unsubscribe { color: #64748b; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>وزارة التربية والتعليم</h1>
        </div>
        <div class="content">
            {$content}
        </div>
        <div class="footer">
            <p>هذه الرسالة تم إرسالها لأنك مشترك في النشرة البريدية.</p>
            <p><a href="{$unsubscribeUrl}" class="unsubscribe">إلغاء الاشتراك</a></p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Get subscriber statistics.
     */
    public function getStatistics(): array
    {
        return [
            'total' => NewsletterSubscriber::count(),
            'active' => NewsletterSubscriber::where('status', 'active')->count(),
            'unsubscribed' => NewsletterSubscriber::where('status', 'unsubscribed')->count(),
            'this_month' => NewsletterSubscriber::where('status', 'active')
                ->whereMonth('subscribed_at', now()->month)
                ->whereYear('subscribed_at', now()->year)
                ->count(),
        ];
    }

    /**
     * Export subscribers to CSV.
     */
    public function exportToCsv(?string $status = null): string
    {
        $query = NewsletterSubscriber::query();

        if ($status) {
            $query->where('status', $status);
        }

        $subscribers = $query->orderBy('subscribed_at', 'desc')->get();

        $csv = "Email,Status,Subscribed At,Unsubscribed At\n";

        foreach ($subscribers as $subscriber) {
            $csv .= sprintf(
                "%s,%s,%s,%s\n",
                $subscriber->email,
                $subscriber->status,
                $subscriber->subscribed_at?->format('Y-m-d H:i:s') ?? '',
                $subscriber->unsubscribed_at?->format('Y-m-d H:i:s') ?? ''
            );
        }

        return $csv;
    }
}
