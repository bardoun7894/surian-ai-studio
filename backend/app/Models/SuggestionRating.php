<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuggestionRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number',
        'rating',
        'comment',
        'feedback_type',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}
