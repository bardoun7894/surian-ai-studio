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
    ];

    protected $casts = [
        'ai_keywords' => 'array',
        'ai_confidence' => 'float',
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
}
