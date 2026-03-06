<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComplaintTemplate extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'directorate_id',
        'name',
        'name_en',
        'description',
        'description_en',
        'type',
        'requires_identification',
        'fields',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'fields' => 'array',
        'is_active' => 'boolean',
        'requires_identification' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function directorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class);
    }
}
