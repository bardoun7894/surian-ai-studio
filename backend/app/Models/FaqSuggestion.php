<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaqSuggestion extends Model
{
    protected $fillable = [
        'question_ar',
        'question_en',
        'answer_ar',
        'answer_en',
        'category',
        'status',
        'occurrence_count',
        'source_conversations',
        'confidence_score',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
        'created_faq_id',
    ];

    protected $casts = [
        'source_conversations' => 'array',
        'confidence_score' => 'float',
        'occurrence_count' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function createdFaq(): BelongsTo
    {
        return $this->belongsTo(Faq::class, 'created_faq_id');
    }

    /**
     * Scope for pending suggestions
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for high confidence suggestions
     */
    public function scopeHighConfidence($query, float $threshold = 0.7)
    {
        return $query->where('confidence_score', '>=', $threshold);
    }

    /**
     * Scope for frequently asked questions
     */
    public function scopeFrequent($query, int $minOccurrences = 3)
    {
        return $query->where('occurrence_count', '>=', $minOccurrences);
    }

    /**
     * Increment occurrence count
     */
    public function incrementOccurrence(string $conversationId = null): void
    {
        $this->occurrence_count++;

        if ($conversationId) {
            $sources = $this->source_conversations ?? [];
            if (!in_array($conversationId, $sources)) {
                $sources[] = $conversationId;
                $this->source_conversations = $sources;
            }
        }

        $this->save();
    }

    /**
     * Approve and create FAQ
     */
    public function approve(int $reviewerId, ?string $notes = null): ?Faq
    {
        $faq = Faq::create([
            'question_ar' => $this->question_ar,
            'question_en' => $this->question_en,
            'answer_ar' => $this->answer_ar,
            'answer_en' => $this->answer_en,
            'category' => $this->category,
            'suggested_by_ai' => true,
            'is_published' => false, // Needs manual publishing
            'is_active' => true,
            'order' => Faq::max('order') + 1,
        ]);

        $this->status = 'approved';
        $this->reviewed_by = $reviewerId;
        $this->reviewed_at = now();
        $this->review_notes = $notes;
        $this->created_faq_id = $faq->id;
        $this->save();

        return $faq;
    }

    /**
     * Reject suggestion
     */
    public function reject(int $reviewerId, ?string $notes = null): void
    {
        $this->status = 'rejected';
        $this->reviewed_by = $reviewerId;
        $this->reviewed_at = now();
        $this->review_notes = $notes;
        $this->save();
    }
}
