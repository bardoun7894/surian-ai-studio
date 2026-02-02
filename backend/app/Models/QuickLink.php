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
}
