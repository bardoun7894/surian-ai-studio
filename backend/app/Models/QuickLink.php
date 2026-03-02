<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuickLink extends Model
{
    protected $fillable = [
        'label_ar',
        'label_en',
        'url',
        'icon',
        'section',
        'directorate_id',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSection($query, string $section)
    {
        return $query->where('section', $section);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    public function scopeForDirectorate($query, ?string $directorateId)
    {
        if ($directorateId) {
            return $query->where('directorate_id', $directorateId);
        }
        return $query->whereNull('directorate_id');
    }

    public function directorate()
    {
        return $this->belongsTo(Directorate::class);
    }
}
