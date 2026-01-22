<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use App\Services\SuggestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SuggestionController extends Controller
{
    protected SuggestionService $suggestionService;
    protected \App\Services\AuditService $auditService;

    public function __construct(SuggestionService $suggestionService, \App\Services\AuditService $auditService)
    {
        $this->suggestionService = $suggestionService;
        $this->auditService = $auditService;
        $this->middleware('auth:sanctum')->except(['store']);
        $this->middleware('role:admin')->only(['index', 'show', 'updateStatus', 'destroy']);
    }

    /**
     * Submit a new suggestion (public endpoint)
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'description' => 'required|string|min:10',
            'files' => 'nullable|array|max:5',
            'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Additional file validation
        $files = $request->file('files', []);
        $fileErrors = $this->suggestionService->validateFiles($files);
        
        if (!empty($fileErrors)) {
            return response()->json([
                'success' => false,
                'errors' => ['files' => $fileErrors]
            ], 422);
        }

        try {
            $suggestion = $this->suggestionService->store(
                $request->only(['name', 'job_title', 'email', 'phone', 'description']),
                $files
            );

            // Log the action
            $this->auditService->log(
                auth()->user(), 
                'suggestion_submitted', 
                'suggestion', 
                $suggestion->id, 
                ['tracking_number' => $suggestion->tracking_number]
            );

            return response()->json([
                'success' => true,
                'message' => 'Suggestion submitted successfully',
                'data' => [
                    'tracking_number' => $suggestion->tracking_number,
                    'status' => $suggestion->status,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit suggestion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * List all suggestions (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Suggestion::with('attachments', 'user');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tracking_number', 'like', "%{$search}%");
            });
        }

        $suggestions = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $suggestions
        ]);
    }

    /**
     * View suggestion details (admin only)
     */
    public function show(string $id): JsonResponse
    {
        $suggestion = Suggestion::with('attachments', 'user')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $suggestion
        ]);
    }

    /**
     * Update suggestion status (admin only)
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in([
                Suggestion::STATUS_PENDING,
                Suggestion::STATUS_REVIEWED,
                Suggestion::STATUS_APPROVED,
                Suggestion::STATUS_REJECTED,
            ])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $suggestion = Suggestion::findOrFail($id);
        $oldStatus = $suggestion->status;
        $suggestion = $this->suggestionService->updateStatus($suggestion, $request->status);

        // Log the action
        $this->auditService->log(
            auth()->user(), 
            'suggestion_status_updated', 
            'suggestion', 
            $suggestion->id, 
            ['old_status' => $oldStatus, 'new_status' => $suggestion->status]
        );

        return response()->json([
            'success' => true,
            'message' => 'Suggestion status updated successfully',
            'data' => $suggestion
        ]);
    }

    /**
     * Delete suggestion (admin only)
     */
    public function destroy(string $id): JsonResponse
    {
        $suggestion = Suggestion::findOrFail($id);
        
        // Log before deletion
        $this->auditService->log(
            auth()->user(), 
            'suggestion_deleted', 
            'suggestion', 
            $suggestion->id, 
            ['tracking_number' => $suggestion->tracking_number]
        );

        // Delete file attachments
        $this->suggestionService->deleteAttachments($suggestion);
        
        // Soft delete the suggestion
        $suggestion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Suggestion deleted successfully'
        ]);
    }
}
