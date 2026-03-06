<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DirectorateTeam extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'directorate_id',
        'name_ar',
        'name_en',
        'position_ar',
        'position_en',
        'image',
        'order'
    ];

    public function directorate()
    {
        return $this->belongsTo(Directorate::class);
    }
}
