<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvestmentApplication extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tracking_number',
        'investment_id',
        'full_name',
        'national_id',
        'company_name',
        'email',
        'phone',
        'proposed_amount',
        'description',
        'status',
        'staff_notes',
    ];

    protected $casts = [
        'proposed_amount' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($application) {
            $application->tracking_number = 'INV-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));
        });
    }

    public function investment(): BelongsTo
    {
        return $this->belongsTo(Investment::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(InvestmentApplicationAttachment::class);
    }

    public function getStatusLabelAttribute(): array
    {
        $labels = [
            'received' => ['ar' => 'واردة', 'en' => 'Received'],
            'under_review' => ['ar' => 'قيد المراجعة', 'en' => 'Under Review'],
            'needs_more_info' => ['ar' => 'يحتاج معلومات إضافية', 'en' => 'Needs More Info'],
            'approved' => ['ar' => 'مقبول', 'en' => 'Approved'],
            'rejected' => ['ar' => 'مرفوض', 'en' => 'Rejected'],
        ];

        return $labels[$this->status] ?? $labels['received'];
    }
}
