<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Suggestion extends Model
{
    use HasFactory, SoftDeletes;

    const STATUS_PENDING = 'pending';
    const STATUS_REVIEWED = 'reviewed';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'name',
        'job_title',
        'email',
        'phone',
        'national_id',
        'dob',
        'directorate_id',
        'is_anonymous',
        'description',
        'status',
        'user_id',
        'tracking_number',
        // Response and review fields (FR-45)
        'response',
        'reviewed_by',
        'reviewed_at',
        // AI analysis fields
        'ai_summary',
        'ai_category',
        'ai_priority',
        'ai_keywords',
        'ai_confidence',
        'ai_suggested_directorate_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'dob' => 'date',
        'is_anonymous' => 'boolean',
        'ai_keywords' => 'array',
        'ai_confidence' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($suggestion) {
            if (empty($suggestion->tracking_number)) {
                $suggestion->tracking_number = self::generateTrackingNumber();
            }
        });
    }

    /**
     * Generate a unique tracking number
     */
    public static function generateTrackingNumber(): string
    {
        do {
            $trackingNumber = 'SUG-' . strtoupper(Str::random(8));
        } while (self::where('tracking_number', $trackingNumber)->exists());

        return $trackingNumber;
    }

    /**
     * Get the user who submitted the suggestion
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the directorate for the suggestion
     */
    public function directorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class);
    }

    /**
     * Get the attachments for the suggestion
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(SuggestionAttachment::class);
    }

    /**
     * Scope to filter by status
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get pending suggestions
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Get the user who reviewed the suggestion
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Update suggestion status with response (FR-45)
     */
    public function updateStatus(string $status, int $reviewerId, ?string $response = null): bool
    {
        if (!in_array($status, [self::STATUS_PENDING, self::STATUS_REVIEWED, self::STATUS_APPROVED, self::STATUS_REJECTED])) {
            return false;
        }

        $this->status = $status;
        $this->reviewed_by = $reviewerId;
        $this->reviewed_at = now();

        if ($response !== null) {
            $this->response = $response;
        }

        return $this->save();
    }

    /**
     * Check if suggestion can be deleted (only if status is pending/received)
     */
    public function canBeDeleted(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }
}
