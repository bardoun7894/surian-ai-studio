<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuggestionAttachment extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'suggestion_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
        'file_size' => 'integer',
    ];

    /**
     * Get the suggestion that owns the attachment
     */
    public function suggestion(): BelongsTo
    {
        return $this->belongsTo(Suggestion::class);
    }

    /**
     * Get the file size in human-readable format
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
