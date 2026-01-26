<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Investment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'sector_ar',
        'sector_en',
        'location_ar',
        'location_en',
        'investment_amount',
        'currency',
        'status',
        'category',
        'icon',
        'image',
        'requirements',
        'fee',
        'processing_time',
        'contact_email',
        'contact_phone',
        'order',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'investment_amount' => 'decimal:2',
        'requirements' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Scope for active investments
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured investments
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope by status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Get formatted investment amount
     */
    public function getFormattedAmountAttribute(): string
    {
        if (!$this->investment_amount) {
            return '-';
        }

        $formatted = number_format($this->investment_amount, 0);
        return $this->currency === 'USD' ? "\${$formatted}" : "{$formatted} {$this->currency}";
    }

    /**
     * Get title based on locale
     */
    public function getTitleAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? $this->title_ar : $this->title_en;
    }

    /**
     * Get description based on locale
     */
    public function getDescriptionAttribute(): ?string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? $this->description_ar : $this->description_en;
    }

    /**
     * Get sector based on locale
     */
    public function getSectorAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? $this->sector_ar : $this->sector_en;
    }

    /**
     * Get location based on locale
     */
    public function getLocationAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? $this->location_ar : $this->location_en;
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): array
    {
        $labels = [
            'available' => ['ar' => 'متاح', 'en' => 'Available'],
            'under_review' => ['ar' => 'قيد الدراسة', 'en' => 'Under Review'],
            'closed' => ['ar' => 'مغلق', 'en' => 'Closed'],
        ];

        return $labels[$this->status] ?? $labels['available'];
    }
}
