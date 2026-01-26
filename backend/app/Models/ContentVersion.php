<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentVersion extends Model
{
    protected $fillable = [
        'content_id',
        'version_number',
        'snapshot',
        'editor_id',
    ];

    protected $casts = [
        'snapshot' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the content that this version belongs to.
     */
    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    /**
     * Get the user who created this version.
     */
    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    /**
     * Get the changes between this version and the previous one
     */
    public function getChanges(): array
    {
        $previous = self::where('content_id', $this->content_id)
            ->where('version_number', '<', $this->version_number)
            ->orderBy('version_number', 'desc')
            ->first();

        if (!$previous) {
            return ['created' => true];
        }

        $changes = [];
        $currentSnapshot = $this->snapshot;
        $previousSnapshot = $previous->snapshot;

        foreach ($currentSnapshot as $key => $value) {
            if (!isset($previousSnapshot[$key]) || $previousSnapshot[$key] !== $value) {
                $changes[$key] = [
                    'old' => $previousSnapshot[$key] ?? null,
                    'new' => $value,
                ];
            }
        }

        return $changes;
    }

    /**
     * Restore this version to the content
     */
    public function restore(): Content
    {
        $content = $this->content;

        // Update content with snapshot data (without triggering events)
        $content->fill($this->snapshot);
        $content->saveQuietly();

        // Create a new version for the restoration
        $content->createVersion(auth()->id());

        return $content;
    }
}
