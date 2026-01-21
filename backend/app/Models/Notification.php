<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'is_read',
        'data',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'data' => 'array',
    ];

    /**
     * Notification types
     */
    const TYPE_COMPLAINT_NEW = 'complaint_new';
    const TYPE_COMPLAINT_STATUS = 'complaint_status_change';
    const TYPE_COMPLAINT_RESPONSE = 'complaint_response';
    const TYPE_COMPLAINT_OVERDUE = 'complaint_overdue';
    const TYPE_SECURITY_ALERT = 'security_alert';
    const TYPE_SYSTEM = 'system';

    /**
     * Get the user that owns the notification.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Scope for unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope for specific type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
