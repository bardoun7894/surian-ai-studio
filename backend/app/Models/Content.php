<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Content extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title_ar',
        'title_en',
        'content_ar',
        'content_en',
        'slug',
        'category',
        'status',
        'featured',
        'published_at',
        'author_id',
        'metadata',
        'seo_title_ar',
        'seo_title_en',
        'seo_description_ar',
        'seo_description_en',
        'tags',
        'view_count',
        'priority',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'metadata' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'view_count' => 'integer',
        'priority' => 'integer',
    ];

    /**
     * Content categories
     */
    public const CATEGORY_NEWS = 'news';
    public const CATEGORY_ANNOUNCEMENT = 'announcement';
    public const CATEGORY_DECREE = 'decree';
    public const CATEGORY_SERVICE = 'service';
    public const CATEGORY_FAQ = 'faq';
    public const CATEGORY_ABOUT = 'about';
    public const CATEGORY_MEDIA = 'media';

    /**
     * Content statuses
     */
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_ARCHIVED = 'archived';

    /**
     * Get the author who created this content.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the attachments for this content (FR-13)
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(ContentAttachment::class)->orderBy('display_order');
    }

    /**
     * Scope a query to only include published content.
     */
    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED)
                     ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include featured content.
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Increment view count
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
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
     * Get localized content
     */
    public function getContent(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        return $locale === 'ar' ? $this->content_ar : $this->content_en;
    }

    /**
     * Get localized SEO title
     */
    public function getSeoTitle(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        return $locale === 'ar'
            ? ($this->seo_title_ar ?? $this->title_ar)
            : ($this->seo_title_en ?? $this->title_en);
    }

    /**
     * Get localized SEO description
     */
    public function getSeoDescription(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        return $locale === 'ar'
            ? ($this->seo_description_ar ?? '')
            : ($this->seo_description_en ?? '');
    }
}
