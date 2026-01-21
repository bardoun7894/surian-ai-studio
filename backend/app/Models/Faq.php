<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = [
        'question_ar',
        'question_en',
        'answer_ar',
        'answer_en',
        'suggested_by_ai',
        'is_published',
        'category',
        'order',
        'is_active',
    ];

    protected $casts = [
        'suggested_by_ai' => 'boolean',
        'is_published' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
