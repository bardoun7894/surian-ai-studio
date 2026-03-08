<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvestmentApplicationAttachment extends Model
{
    protected $fillable = [
        'investment_application_id',
        'file_path',
        'file_name',
        'mime_type',
        'size',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(InvestmentApplication::class, 'investment_application_id');
    }
}
