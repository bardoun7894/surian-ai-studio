<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $title;
    public string $body;
    public array $data;
    public string $actionUrl;
    public string $actionText;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $title,
        string $body,
        array $data = [],
        ?string $actionUrl = null,
        ?string $actionText = null
    ) {
        $this->title = $title;
        $this->body = $body;
        $this->data = $data;
        $this->actionUrl = $actionUrl ?? config('app.url');
        $this->actionText = $actionText ?? 'زيارة الموقع';
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notification',
            with: [
                'title' => $this->title,
                'body' => $this->body,
                'data' => $this->data,
                'actionUrl' => $this->actionUrl,
                'actionText' => $this->actionText,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
