<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * M1-T3: Staged upload model — files uploaded before form submission.
 */
class StagedUpload extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'session_token',
        'file_path',
        'file_name',
        'mime_type',
        'size',
        'context',
        'claimed',
        'expires_at',
    ];

    protected $casts = [
        'claimed' => 'boolean',
        'size' => 'integer',
        'expires_at' => 'datetime',
    ];

    /**
     * Scope: only unclaimed, non-expired rows that match the given session.
     */
    public function scopeAvailable($query, string $sessionToken)
    {
        return $query
            ->where('session_token', $sessionToken)
            ->where('claimed', false)
            ->where('expires_at', '>', now());
    }
}
