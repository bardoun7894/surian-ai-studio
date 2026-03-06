<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'email',
        'status',
        'unsubscribe_token',
        'subscribed_at',
        'unsubscribed_at',
    ];

    protected $casts = [
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    /**
     * Scope to get only active subscribers
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Generate a unique unsubscribe token
     */
    public static function generateUnsubscribeToken(): string
    {
        return Str::random(64);
    }

    /**
     * Check if the subscriber is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Subscribe the email
     */
    public function subscribe(): void
    {
        $this->status = 'active';
        $this->subscribed_at = now();
        $this->unsubscribed_at = null;
        $this->unsubscribe_token = self::generateUnsubscribeToken();
        $this->save();
    }

    /**
     * Unsubscribe the email
     */
    public function unsubscribe(): void
    {
        $this->status = 'unsubscribed';
        $this->unsubscribed_at = now();
        $this->save();
    }

    /**
     * Route notifications for the mail channel.
     */
    public function routeNotificationForMail(): string
    {
        return $this->email;
    }
}
