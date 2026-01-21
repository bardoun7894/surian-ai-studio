<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintSummary extends Model
{
    protected $fillable = [
        'period_type',
        'period_start',
        'period_end',
        'directorate_id',
        'category',
        'total_complaints',
        'resolved_count',
        'pending_count',
        'status_breakdown',
        'priority_breakdown',
        'top_categories',
        'recurring_issues',
        'ai_summary_ar',
        'ai_summary_en',
        'ai_recommendations',
        'keywords',
        'avg_resolution_days',
        'ai_confidence',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'status_breakdown' => 'array',
        'priority_breakdown' => 'array',
        'top_categories' => 'array',
        'recurring_issues' => 'array',
        'keywords' => 'array',
        'avg_resolution_days' => 'float',
        'ai_confidence' => 'float',
    ];

    public function directorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class);
    }

    /**
     * Scope for filtering by period type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('period_type', $type);
    }

    /**
     * Scope for filtering by date range
     */
    public function scopeInPeriod($query, $start, $end)
    {
        return $query->where('period_start', '>=', $start)
                     ->where('period_end', '<=', $end);
    }

    /**
     * Get the latest summary for a given type and directorate
     */
    public static function getLatest(string $type = 'weekly', ?int $directorateId = null)
    {
        $query = static::ofType($type)->orderBy('period_end', 'desc');

        if ($directorateId) {
            $query->where('directorate_id', $directorateId);
        } else {
            $query->whereNull('directorate_id');
        }

        return $query->first();
    }
}
