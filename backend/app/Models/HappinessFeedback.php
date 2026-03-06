<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HappinessFeedback extends Model
{
    protected $table = 'happiness_feedback';

    protected $fillable = [
        'rating',
        'page',
        'session_id',
        'user_id',
        'ip_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
