<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Complaint extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tracking_number',
        'user_id',
        'directorate_id',
        'related_complaint_id',
        'template_id',
        'template_fields',
        'full_name',
        'national_id',
        'phone',
        'email',
        'title',
        'description',
        'status',
        'priority',
        'ai_summary',
        'ai_category',
        'ai_priority',
        'ai_keywords',
        'ai_confidence',
        'ai_suggested_directorate_id',
        // User satisfaction rating (FR-25)
        'rating',
        'rating_comment',
        'rated_at',
        // Snooze feature (FR-35)
        'snoozed_until',
        'snoozed_by',
        // Escalation tracking (FR-68, FR-69)
        'escalation_level',
        'first_warning_at',
        'final_escalation_at',
    ];

    protected $casts = [
        'template_fields' => 'array',
        'ai_keywords' => 'array',
        'ai_confidence' => 'float',
        'rated_at' => 'datetime',
        'snoozed_until' => 'datetime',
        'first_warning_at' => 'datetime',
        'final_escalation_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($complaint) {
            $complaint->tracking_number = 'CMP-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function directorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ComplaintTemplate::class);
    }

    public function relatedComplaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class, 'related_complaint_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ComplaintAttachment::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(ComplaintResponse::class);
    }

    public function snoozedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'snoozed_by');
    }

    /**
     * Scope to exclude snoozed complaints
     */
    public function scopeNotSnoozed($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('snoozed_until')
              ->orWhere('snoozed_until', '<=', now());
        });
    }

    /**
     * Scope to get only snoozed complaints
     */
    public function scopeSnoozed($query)
    {
        return $query->where('snoozed_until', '>', now());
    }

    /**
     * Check if complaint is currently snoozed
     */
    public function isSnoozed(): bool
    {
        return $this->snoozed_until && $this->snoozed_until->isFuture();
    }

    /**
     * Check if complaint can be rated
     */
    public function canBeRated(): bool
    {
        return in_array($this->status, ['completed', 'resolved', 'closed']) && is_null($this->rating);
    }

    /**
     * Rate the complaint (FR-25)
     */
    public function rate(int $rating, ?string $comment = null): bool
    {
        if (!$this->canBeRated()) {
            return false;
        }

        if ($rating < 1 || $rating > 5) {
            return false;
        }

        $this->rating = $rating;
        $this->rating_comment = $comment;
        $this->rated_at = now();
        return $this->save();
    }

    /**
     * Snooze the complaint (FR-35)
     */
    public function snooze(int $days, int $userId): bool
    {
        if ($days < 1 || $days > 3) {
            return false;
        }

        $this->snoozed_until = now()->addDays($days);
        $this->snoozed_by = $userId;
        return $this->save();
    }

    /**
     * Unsnooze the complaint
     */
    public function unsnooze(): bool
    {
        $this->snoozed_until = null;
        $this->snoozed_by = null;
        return $this->save();
    }
}
