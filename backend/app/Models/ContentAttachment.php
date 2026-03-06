<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ContentAttachment extends Model
{
    protected $fillable = [
        'content_id',
        'file_name',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'display_order',
        'is_public',
        'download_count',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'file_size' => 'integer',
        'download_count' => 'integer',
        'display_order' => 'integer',
    ];

    /**
     * File types
     */
    public const TYPE_DOCUMENT = 'document';
    public const TYPE_IMAGE = 'image';
    public const TYPE_VIDEO = 'video';
    public const TYPE_AUDIO = 'audio';
    public const TYPE_OTHER = 'other';

    /**
     * Get the content that owns this attachment
     */
    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    /**
     * Get the full URL for the attachment
     */
    public function getUrl(): string
    {
        return Storage::url($this->file_path);
    }

    /**
     * Get the file size in human-readable format
     */
    public function getFileSizeFormatted(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $power = $bytes > 0 ? floor(log($bytes, 1024)) : 0;

        return number_format($bytes / pow(1024, $power), 2, '.', ',') . ' ' . $units[$power];
    }

    /**
     * Detect file type from mime type
     */
    public static function detectFileType(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) {
            return self::TYPE_IMAGE;
        }

        if (str_starts_with($mimeType, 'video/')) {
            return self::TYPE_VIDEO;
        }

        if (str_starts_with($mimeType, 'audio/')) {
            return self::TYPE_AUDIO;
        }

        $documentMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
        ];

        if (in_array($mimeType, $documentMimes)) {
            return self::TYPE_DOCUMENT;
        }

        return self::TYPE_OTHER;
    }

    /**
     * Increment download count
     */
    public function incrementDownloads(): void
    {
        $this->increment('download_count');
    }

    /**
     * Get localized title
     */
    public function getTitle(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        $title = $locale === 'ar' ? $this->title_ar : $this->title_en;

        return $title ?: $this->file_name;
    }

    /**
     * Get localized description
     */
    public function getDescription(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();
        return $locale === 'ar' ? ($this->description_ar ?? '') : ($this->description_en ?? '');
    }
}
