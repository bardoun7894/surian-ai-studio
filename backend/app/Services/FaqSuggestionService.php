<?php

namespace App\Services;

use App\Models\ChatConversation;
use App\Models\Faq;
use App\Models\FaqSuggestion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FaqSuggestionService
{
    protected AIService $aiService;
    protected VectorSearchService $vectorService;

    public function __construct(AIService $aiService, VectorSearchService $vectorService)
    {
        $this->aiService = $aiService;
        $this->vectorService = $vectorService;
    }

    /**
     * FR-43: Analyze recent chat conversations and extract FAQ suggestions
     */
    public function analyzeConversations(int $hoursBack = 24, int $minOccurrences = 3): array
    {
        $since = now()->subHours($hoursBack);

        // Get recent conversations
        $conversations = ChatConversation::where('updated_at', '>=', $since)
            ->whereNotNull('messages')
            ->get();

        if ($conversations->isEmpty()) {
            return ['analyzed' => 0, 'suggestions' => 0];
        }

        $analyzedCount = 0;
        $suggestionCount = 0;

        foreach ($conversations as $conversation) {
            try {
                $suggestions = $this->extractQuestionsFromConversation($conversation);

                foreach ($suggestions as $suggestion) {
                    $created = $this->processQuestionSuggestion($suggestion, $conversation->id);
                    if ($created) {
                        $suggestionCount++;
                    }
                }

                $analyzedCount++;
            } catch (\Exception $e) {
                Log::error('Failed to analyze conversation', [
                    'conversation_id' => $conversation->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return [
            'analyzed' => $analyzedCount,
            'suggestions' => $suggestionCount,
        ];
    }

    /**
     * Extract question-answer pairs from a conversation
     */
    protected function extractQuestionsFromConversation(ChatConversation $conversation): array
    {
        $messages = $conversation->messages ?? [];

        if (count($messages) < 2) {
            return [];
        }

        // Find user questions and AI answers
        $pairs = [];
        for ($i = 0; $i < count($messages) - 1; $i++) {
            $current = $messages[$i];
            $next = $messages[$i + 1];

            if (($current['role'] ?? '') === 'user' && ($next['role'] ?? '') === 'assistant') {
                $question = trim($current['content'] ?? '');
                $answer = trim($next['content'] ?? '');

                // Filter out very short or greeting messages
                if (strlen($question) > 20 && strlen($answer) > 50) {
                    // Check if it looks like a real question
                    if ($this->isLikelyFaqQuestion($question)) {
                        $pairs[] = [
                            'question' => $question,
                            'answer' => $answer,
                        ];
                    }
                }
            }
        }

        return $pairs;
    }

    /**
     * Check if a message looks like a FAQ-worthy question
     */
    protected function isLikelyFaqQuestion(string $question): bool
    {
        // Arabic question indicators
        $arabicPatterns = [
            'كيف',     // How
            'ما',      // What
            'ماذا',    // What
            'هل',      // Is/Are
            'لماذا',   // Why
            'متى',     // When
            'أين',     // Where
            'من',      // Who
            '؟',       // Arabic question mark
        ];

        // English question indicators
        $englishPatterns = [
            'how',
            'what',
            'why',
            'when',
            'where',
            'who',
            'can i',
            'is it',
            'are there',
            '?',
        ];

        $lowerQuestion = mb_strtolower($question);

        foreach (array_merge($arabicPatterns, $englishPatterns) as $pattern) {
            if (mb_strpos($lowerQuestion, mb_strtolower($pattern)) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Process a question suggestion - check for duplicates and create/update suggestion
     */
    protected function processQuestionSuggestion(array $suggestion, string $conversationId): bool
    {
        $question = $suggestion['question'];
        $answer = $suggestion['answer'];

        // Check if similar question already exists in FAQs
        if ($this->isAlreadyInFaq($question)) {
            return false;
        }

        // Check if similar suggestion already exists
        $existingSuggestion = $this->findSimilarSuggestion($question);

        if ($existingSuggestion) {
            // Update existing suggestion
            $existingSuggestion->incrementOccurrence($conversationId);
            return false;
        }

        // Determine if question is Arabic or English
        $isArabic = $this->isArabic($question);

        // Create new suggestion
        FaqSuggestion::create([
            'question_ar' => $isArabic ? $question : null,
            'question_en' => !$isArabic ? $question : null,
            'answer_ar' => $isArabic ? $answer : null,
            'answer_en' => !$isArabic ? $answer : null,
            'status' => 'pending',
            'occurrence_count' => 1,
            'source_conversations' => [$conversationId],
            'confidence_score' => $this->calculateConfidenceScore($question, $answer),
        ]);

        return true;
    }

    /**
     * Check if a similar question already exists in FAQs
     */
    protected function isAlreadyInFaq(string $question): bool
    {
        // First try exact match
        $exactMatch = Faq::where('question_ar', 'ILIKE', '%' . $question . '%')
            ->orWhere('question_en', 'ILIKE', '%' . $question . '%')
            ->exists();

        if ($exactMatch) {
            return true;
        }

        // Try semantic similarity if vector search is available
        try {
            $embedding = $this->vectorService->generateEmbedding($question);

            if ($embedding) {
                // Search for similar FAQs (this would require faqs to have embeddings)
                $similarFaqs = DB::select("
                    SELECT id, question_ar, question_en
                    FROM faqs
                    WHERE embedding IS NOT NULL
                    AND (1 - (embedding <=> ?::vector)) > 0.85
                    LIMIT 1
                ", [json_encode($embedding)]);

                return !empty($similarFaqs);
            }
        } catch (\Exception $e) {
            // Vector search not available, fall back to text matching
        }

        return false;
    }

    /**
     * Find similar suggestion that already exists
     */
    protected function findSimilarSuggestion(string $question): ?FaqSuggestion
    {
        return FaqSuggestion::where('status', 'pending')
            ->where(function ($query) use ($question) {
                $query->where('question_ar', 'ILIKE', '%' . $question . '%')
                    ->orWhere('question_en', 'ILIKE', '%' . $question . '%');
            })
            ->first();
    }

    /**
     * Calculate confidence score for a suggestion
     */
    protected function calculateConfidenceScore(string $question, string $answer): float
    {
        $score = 0.5; // Base score

        // Longer answers typically indicate better quality
        if (strlen($answer) > 200) {
            $score += 0.1;
        }
        if (strlen($answer) > 500) {
            $score += 0.1;
        }

        // Questions with question marks are clearer
        if (str_contains($question, '?') || str_contains($question, '؟')) {
            $score += 0.1;
        }

        // Reasonable question length
        if (strlen($question) >= 30 && strlen($question) <= 200) {
            $score += 0.1;
        }

        return min(1.0, $score);
    }

    /**
     * Check if text is primarily Arabic
     */
    protected function isArabic(string $text): bool
    {
        // Count Arabic characters
        preg_match_all('/[\x{0600}-\x{06FF}]/u', $text, $arabicMatches);
        $arabicCount = count($arabicMatches[0]);

        // Count Latin characters
        preg_match_all('/[a-zA-Z]/', $text, $latinMatches);
        $latinCount = count($latinMatches[0]);

        return $arabicCount > $latinCount;
    }

    /**
     * Get pending suggestions with stats
     */
    public function getPendingSuggestions(int $limit = 20, int $minOccurrences = 1): array
    {
        return FaqSuggestion::pending()
            ->where('occurrence_count', '>=', $minOccurrences)
            ->orderByDesc('occurrence_count')
            ->orderByDesc('confidence_score')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get suggestion statistics
     */
    public function getStats(): array
    {
        return [
            'total_pending' => FaqSuggestion::pending()->count(),
            'total_approved' => FaqSuggestion::where('status', 'approved')->count(),
            'total_rejected' => FaqSuggestion::where('status', 'rejected')->count(),
            'high_confidence' => FaqSuggestion::pending()->highConfidence()->count(),
            'frequent' => FaqSuggestion::pending()->frequent()->count(),
        ];
    }

    /**
     * Use AI to generate better FAQ from suggestion
     */
    public function enhanceSuggestion(FaqSuggestion $suggestion): array
    {
        $prompt = $this->buildEnhancementPrompt($suggestion);

        try {
            $response = $this->aiService->summarize(
                $prompt,
                'You are a content writer creating FAQ entries for a government ministry website.'
            );

            // Parse the AI response to extract enhanced Q&A
            return $this->parseEnhancedResponse($response, $suggestion);
        } catch (\Exception $e) {
            Log::error('Failed to enhance FAQ suggestion', [
                'suggestion_id' => $suggestion->id,
                'error' => $e->getMessage(),
            ]);

            // Return original content on failure
            return [
                'question_ar' => $suggestion->question_ar,
                'question_en' => $suggestion->question_en,
                'answer_ar' => $suggestion->answer_ar,
                'answer_en' => $suggestion->answer_en,
            ];
        }
    }

    /**
     * Build prompt for AI enhancement
     */
    protected function buildEnhancementPrompt(FaqSuggestion $suggestion): string
    {
        $question = $suggestion->question_ar ?? $suggestion->question_en;
        $answer = $suggestion->answer_ar ?? $suggestion->answer_en;

        return <<<PROMPT
Please enhance this FAQ entry for a government ministry website. Make it clear, professional, and helpful.

Original Question: {$question}

Original Answer: {$answer}

Please provide:
1. An improved question in Arabic (question_ar)
2. The question in English (question_en)
3. An improved answer in Arabic (answer_ar)
4. The answer in English (answer_en)

Format your response as JSON:
{
  "question_ar": "...",
  "question_en": "...",
  "answer_ar": "...",
  "answer_en": "..."
}
PROMPT;
    }

    /**
     * Parse AI response for enhanced FAQ content
     */
    protected function parseEnhancedResponse(string $response, FaqSuggestion $suggestion): array
    {
        // Try to extract JSON from response
        if (preg_match('/\{[^}]+\}/s', $response, $matches)) {
            $data = json_decode($matches[0], true);
            if ($data) {
                return [
                    'question_ar' => $data['question_ar'] ?? $suggestion->question_ar,
                    'question_en' => $data['question_en'] ?? $suggestion->question_en,
                    'answer_ar' => $data['answer_ar'] ?? $suggestion->answer_ar,
                    'answer_en' => $data['answer_en'] ?? $suggestion->answer_en,
                ];
            }
        }

        // Return original if parsing fails
        return [
            'question_ar' => $suggestion->question_ar,
            'question_en' => $suggestion->question_en,
            'answer_ar' => $suggestion->answer_ar,
            'answer_en' => $suggestion->answer_en,
        ];
    }
}
