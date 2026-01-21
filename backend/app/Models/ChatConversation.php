<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ChatConversation extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'messages',
        'metadata',
        'handoff_requested',
        'handoff_requested_at',
        'handoff_reason',
        'handoff_status',
        'handoff_assigned_to',
        'handoff_assigned_at',
        'handoff_closed_at',
    ];

    protected $casts = [
        'messages' => 'array',
        'metadata' => 'array',
        'handoff_requested' => 'boolean',
        'handoff_requested_at' => 'datetime',
        'handoff_assigned_at' => 'datetime',
        'handoff_closed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handoff_assigned_to');
    }

    /**
     * Add a message to the conversation
     */
    public function addMessage(string $role, string $content, array $extra = []): void
    {
        $messages = $this->messages ?? [];
        $messages[] = array_merge([
            'role' => $role,
            'content' => $content,
            'timestamp' => now()->toIso8601String(),
        ], $extra);
        $this->messages = $messages;
        $this->save();
    }

    /**
     * Scope to get conversations older than 3 months (for cleanup)
     */
    public function scopeOlderThanThreeMonths($query)
    {
        return $query->where('created_at', '<', Carbon::now()->subMonths(3));
    }

    /**
     * Get conversation by session ID
     */
    public static function findBySession(string $sessionId): ?self
    {
        return static::where('session_id', $sessionId)->first();
    }
}
