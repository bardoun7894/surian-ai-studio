<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class PromotionalSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'button_text_ar',
        'button_text_en',
        'image',
        'background_color',
        'icon',
        'button_url',
        'type',
        'position',
        'display_order',
        'is_active',
        'published_at',
        'expires_at',
        'metadata',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'metadata' => 'array',
        'display_order' => 'integer',
    ];

    /**
     * Scope for active sections
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for published sections (active + published_at is in past + not expired)
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->active()
            ->where(function ($q) {
                $q->whereNull('published_at')
                  ->orWhere('published_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope by position
     */
    public function scopePosition(Builder $query, string $position): Builder
    {
        return $query->where('position', $position);
    }

    /**
     * Scope by type
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for ordering by display_order
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('display_order', 'asc');
    }

    /**
     * Get localized title
     */
    public function getTitle(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        return $locale === 'ar' ? $this->title_ar : $this->title_en;
    }

    /**
     * Get localized description
     */
    public function getDescription(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        return $locale === 'ar' ? $this->description_ar : $this->description_en;
    }

    /**
     * Get localized button text
     */
    public function getButtonText(?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        return $locale === 'ar' ? $this->button_text_ar : $this->button_text_en;
    }

    /**
     * Check if section is visible (active + published + not expired)
     */
    public function isVisible(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->published_at && $this->published_at->isFuture()) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Get image URL
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // If it's already a full URL, return as-is
        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return asset('storage/' . $this->image);
    }

    /**
     * Get type label
     */
    public function getTypeLabelAttribute(): array
    {
        $labels = [
            'banner' => ['ar' => 'بانر', 'en' => 'Banner'],
            'video' => ['ar' => 'فيديو', 'en' => 'Video'],
            'promo' => ['ar' => 'ترويجي', 'en' => 'Promotional'],
            'stats' => ['ar' => 'إحصائيات', 'en' => 'Statistics'],
        ];

        return $labels[$this->type] ?? $labels['promo'];
    }

    /**
     * Get position label
     */
    public function getPositionLabelAttribute(): array
    {
        $labels = [
            'hero' => ['ar' => 'الرئيسي', 'en' => 'Hero'],
            'grid_main' => ['ar' => 'الشبكة الرئيسية', 'en' => 'Grid Main'],
            'grid_side' => ['ar' => 'الشبكة الجانبية', 'en' => 'Grid Side'],
            'grid_bottom' => ['ar' => 'أسفل الشبكة', 'en' => 'Grid Bottom'],
        ];

        return $labels[$this->position] ?? $labels['grid_bottom'];
    }
}
