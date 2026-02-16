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
        'expires_at',
        'author_id',
        'metadata',
        'seo_title_ar',
        'seo_title_en',
        'seo_description_ar',
        'seo_description_en',
        'tags',
        'view_count',
        'priority',
        'directorate_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'metadata' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'view_count' => 'integer',
        'priority' => 'integer',
    ];

    /**
     * Boot method to automatically create versions (FR-14)
     */
    protected static function booted()
    {
        // Create version after content is updated
        static::updated(function ($content) {
            // Only create version if substantial fields changed
            $versionableFields = [
                'title_ar', 'title_en', 'content_ar', 'content_en',
                'slug', 'category', 'status', 'published_at', 'metadata'
            ];

            $changed = array_keys($content->getChanges());
            $hasVersionableChange = !empty(array_intersect($changed, $versionableFields));

            if ($hasVersionableChange) {
                $content->createVersion();
            }
        });
    }

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
    public const CATEGORY_PAGE = 'page';

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
     * Get the directorate this content belongs to.
     */
    public function directorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class);
    }

    /**
     * Get the attachments for this content (FR-13)
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(ContentAttachment::class)->orderBy('display_order');
    }

    /**
     * Get all versions of this content (FR-14: Content Versioning)
     */
    public function versions(): HasMany
    {
        return $this->hasMany(ContentVersion::class)->orderBy('version_number', 'desc');
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
     * Scope a query to only include active (not expired) content.
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Scope a query to only include expired content.
     */
    public function scopeExpired($query)
    {
        return $query->whereNotNull('expires_at')
                     ->where('expires_at', '<=', now());
    }

    /**
     * Check if the content is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
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

    /**
     * Create a new version snapshot (FR-14)
     */
    public function createVersion(?int $editorId = null): ContentVersion
    {
        // Get next version number
        $latestVersion = $this->versions()->max('version_number') ?? 0;
        $nextVersion = $latestVersion + 1;

        // Create snapshot of current state
        $snapshot = $this->only([
            'title_ar',
            'title_en',
            'content_ar',
            'content_en',
            'slug',
            'category',
            'status',
            'featured',
            'published_at',
            'metadata',
            'seo_title_ar',
            'seo_title_en',
            'seo_description_ar',
            'seo_description_en',
            'tags',
            'priority',
        ]);

        return ContentVersion::create([
            'content_id' => $this->id,
            'version_number' => $nextVersion,
            'snapshot' => $snapshot,
            'editor_id' => $editorId ?? auth()->id(),
        ]);
    }

    /**
     * Get the latest version
     */
    public function getLatestVersion(): ?ContentVersion
    {
        return $this->versions()->first();
    }

    /**
     * Get version by number
     */
    public function getVersion(int $versionNumber): ?ContentVersion
    {
        return $this->versions()->where('version_number', $versionNumber)->first();
    }

    /**
     * Restore to a specific version
     */
    public function restoreToVersion(int $versionNumber): bool
    {
        $version = $this->getVersion($versionNumber);

        if (!$version) {
            return false;
        }

        $version->restore();
        return true;
    }
}
