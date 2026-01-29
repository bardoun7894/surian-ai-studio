<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'directorate_id',
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'icon',
        'category',
        'is_digital',
        'is_active',
        'url',
        'fees',
        'estimated_time',
        'requirements',
        'attachments',
        'display_order',
    ];

    protected $casts = [
        'is_digital' => 'boolean',
        'is_active' => 'boolean',
        'attachments' => 'array',
    ];

    public function directorate()
    {
        return $this->belongsTo(Directorate::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    public function scopeDigital($query)
    {
        return $query->where('is_digital', true);
    }
}
