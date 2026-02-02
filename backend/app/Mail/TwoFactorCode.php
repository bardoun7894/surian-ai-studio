<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TwoFactorCode extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $otp;

    public function __construct(string $otp)
    {
        $this->otp = $otp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'رمز التحقق - وزارة الاقتصاد والصناعة',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.two-factor-code',
            with: [
                'otp' => $this->otp,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
