<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubDirectorate extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_directorate_id',
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'phone',
        'email',
        'address_ar',
        'address_en',
        'url',
        'is_external',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_external' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the parent directorate
     */
    public function directorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class, 'parent_directorate_id');
    }

    /**
     * Scope to get only active sub-directorates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by the order field
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
