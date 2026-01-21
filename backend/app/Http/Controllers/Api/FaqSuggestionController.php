<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FaqSuggestion;
use App\Services\AuditService;
use App\Services\FaqSuggestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FaqSuggestionController extends Controller
{
    public function __construct(
        protected FaqSuggestionService $suggestionService,
        protected AuditService $auditService
    ) {}

    /**
     * FR-43: Get all FAQ suggestions
     */
    public function index(Request $request): JsonResponse
    {
        $query = FaqSuggestion::with('reviewer');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by minimum occurrences
        if ($request->has('min_occurrences')) {
            $query->where('occurrence_count', '>=', (int) $request->input('min_occurrences'));
        }

        // Filter by minimum confidence
        if ($request->has('min_confidence')) {
            $query->where('confidence_score', '>=', (float) $request->input('min_confidence'));
        }

        // Sort
        $sortBy = $request->input('sort_by', 'occurrence_count');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = min((int) $request->input('per_page', 20), 100);
        $suggestions = $query->paginate($perPage);

        return response()->json([
            'suggestions' => $suggestions->items(),
            'meta' => [
                'total' => $suggestions->total(),
                'current_page' => $suggestions->currentPage(),
                'last_page' => $suggestions->lastPage(),
                'per_page' => $suggestions->perPage(),
            ],
        ]);
    }

    /**
     * FR-43: Get suggestion statistics
     */
    public function stats(): JsonResponse
    {
        $stats = $this->suggestionService->getStats();

        return response()->json([
            'stats' => $stats,
        ]);
    }

    /**
     * FR-43: Get a single suggestion
     */
    public function show(int $id): JsonResponse
    {
        $suggestion = FaqSuggestion::with('reviewer', 'createdFaq')->find($id);

        if (!$suggestion) {
            return response()->json([
                'message' => 'Suggestion not found',
            ], 404);
        }

        return response()->json([
            'suggestion' => $suggestion,
        ]);
    }

    /**
     * FR-43: Approve a suggestion and create FAQ
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $suggestion = FaqSuggestion::find($id);

        if (!$suggestion) {
            return response()->json([
                'message' => 'Suggestion not found',
            ], 404);
        }

        if ($suggestion->status !== 'pending') {
            return response()->json([
                'message' => 'Suggestion has already been reviewed',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string|max:1000',
            'question_ar' => 'nullable|string',
            'question_en' => 'nullable|string',
            'answer_ar' => 'nullable|string',
            'answer_en' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update suggestion with edited content if provided
        if ($request->filled('question_ar')) {
            $suggestion->question_ar = $request->input('question_ar');
        }
        if ($request->filled('question_en')) {
            $suggestion->question_en = $request->input('question_en');
        }
        if ($request->filled('answer_ar')) {
            $suggestion->answer_ar = $request->input('answer_ar');
        }
        if ($request->filled('answer_en')) {
            $suggestion->answer_en = $request->input('answer_en');
        }
        $suggestion->save();

        // Approve and create FAQ
        $faq = $suggestion->approve(
            $request->user()->id,
            $request->input('notes')
        );

        // Audit log
        $this->auditService->log(
            'faq_suggestion_approved',
            'faq_suggestion',
            $suggestion->id,
            [
                'created_faq_id' => $faq?->id,
                'question' => $suggestion->question_ar ?? $suggestion->question_en,
            ]
        );

        return response()->json([
            'message' => 'Suggestion approved and FAQ created',
            'suggestion' => $suggestion,
            'faq' => $faq,
        ]);
    }

    /**
     * FR-43: Reject a suggestion
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        $suggestion = FaqSuggestion::find($id);

        if (!$suggestion) {
            return response()->json([
                'message' => 'Suggestion not found',
            ], 404);
        }

        if ($suggestion->status !== 'pending') {
            return response()->json([
                'message' => 'Suggestion has already been reviewed',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $suggestion->reject(
            $request->user()->id,
            $request->input('notes')
        );

        // Audit log
        $this->auditService->log(
            'faq_suggestion_rejected',
            'faq_suggestion',
            $suggestion->id,
            [
                'question' => $suggestion->question_ar ?? $suggestion->question_en,
                'notes' => $request->input('notes'),
            ]
        );

        return response()->json([
            'message' => 'Suggestion rejected',
            'suggestion' => $suggestion,
        ]);
    }

    /**
     * FR-43: Enhance a suggestion using AI
     */
    public function enhance(int $id): JsonResponse
    {
        $suggestion = FaqSuggestion::find($id);

        if (!$suggestion) {
            return response()->json([
                'message' => 'Suggestion not found',
            ], 404);
        }

        $enhanced = $this->suggestionService->enhanceSuggestion($suggestion);

        return response()->json([
            'suggestion' => $suggestion,
            'enhanced' => $enhanced,
        ]);
    }

    /**
     * FR-43: Manually trigger conversation analysis
     */
    public function analyze(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'hours_back' => 'nullable|integer|min:1|max:168', // Max 1 week
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $hoursBack = (int) $request->input('hours_back', 24);
        $result = $this->suggestionService->analyzeConversations($hoursBack);

        // Audit log
        $this->auditService->log(
            'faq_suggestions_analyzed',
            'faq_suggestion',
            null,
            [
                'hours_back' => $hoursBack,
                'conversations_analyzed' => $result['analyzed'],
                'suggestions_created' => $result['suggestions'],
            ]
        );

        return response()->json([
            'message' => 'Conversation analysis completed',
            'result' => $result,
        ]);
    }

    /**
     * FR-43: Bulk approve suggestions
     */
    public function bulkApprove(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:faq_suggestions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $approved = [];
        $errors = [];

        foreach ($request->input('ids') as $id) {
            $suggestion = FaqSuggestion::find($id);

            if (!$suggestion || $suggestion->status !== 'pending') {
                $errors[] = [
                    'id' => $id,
                    'error' => 'Not found or already reviewed',
                ];
                continue;
            }

            $faq = $suggestion->approve($request->user()->id);
            $approved[] = [
                'suggestion_id' => $suggestion->id,
                'faq_id' => $faq?->id,
            ];
        }

        return response()->json([
            'message' => 'Bulk approval completed',
            'approved' => $approved,
            'errors' => $errors,
        ]);
    }

    /**
     * FR-43: Bulk reject suggestions
     */
    public function bulkReject(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:faq_suggestions,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $rejected = [];
        $errors = [];

        foreach ($request->input('ids') as $id) {
            $suggestion = FaqSuggestion::find($id);

            if (!$suggestion || $suggestion->status !== 'pending') {
                $errors[] = [
                    'id' => $id,
                    'error' => 'Not found or already reviewed',
                ];
                continue;
            }

            $suggestion->reject($request->user()->id, $request->input('notes'));
            $rejected[] = $suggestion->id;
        }

        return response()->json([
            'message' => 'Bulk rejection completed',
            'rejected' => $rejected,
            'errors' => $errors,
        ]);
    }

    /**
     * FR-43: Delete a suggestion
     */
    public function destroy(int $id): JsonResponse
    {
        $suggestion = FaqSuggestion::find($id);

        if (!$suggestion) {
            return response()->json([
                'message' => 'Suggestion not found',
            ], 404);
        }

        $suggestion->delete();

        return response()->json([
            'message' => 'Suggestion deleted',
        ]);
    }
}
