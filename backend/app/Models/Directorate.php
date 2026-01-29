<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Directorate extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'id',
        'name_ar',
        'name_en',
        'description',
        'icon',
        'logo_path',
        'is_active',
        'featured',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'featured' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function subDirectorates()
    {
        return $this->hasMany(SubDirectorate::class, 'parent_directorate_id');
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Scope to get only featured directorates
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true)->limit(3);
    }
}
