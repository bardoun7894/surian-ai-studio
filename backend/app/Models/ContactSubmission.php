<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'department',
        'recipient_email',
        'recipient_name',
        'ip_address',
        'user_agent',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];
}
