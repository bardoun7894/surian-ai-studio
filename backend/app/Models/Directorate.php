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
        'latitude',
        'longitude',
        'address_ar',
        'address_en',
        'email',
        'phone',
        'website',
        'working_hours_ar',
        'working_hours_en',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'featured' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
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

    public function contents()
    {
        return $this->hasMany(Content::class);
    }

    public function news()
    {
        return $this->hasMany(Content::class)->where('category', Content::CATEGORY_NEWS);
    }

    public function team()
    {
        return $this->hasMany(DirectorateTeam::class)->orderBy('order');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true)->whereNotIn('id', ['d_central'])->limit(3);
    }
}
