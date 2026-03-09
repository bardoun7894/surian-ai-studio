<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use App\Notifications\SuggestionSubmitted;
use App\Services\SuggestionService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SuggestionController extends Controller
{
    protected SuggestionService $suggestionService;
    protected \App\Services\AuditService $auditService;
    protected NotificationService $notificationService;

    public function __construct(
        SuggestionService $suggestionService,
        \App\Services\AuditService $auditService,
        NotificationService $notificationService
    ) {
        $this->suggestionService = $suggestionService;
        $this->auditService = $auditService;
        $this->notificationService = $notificationService;
    }

    /**
     * Submit a new suggestion (public endpoint)
     */
    public function store(Request $request): JsonResponse
    {
        $isAnonymous = $request->boolean('is_anonymous');

        // Bug #350: Strengthened server-side validation
        $rules = [
            'description' => 'required|string|min:10|max:5000',
            'directorate_id' => 'required|exists:directorates,id',
            'files' => 'nullable|array|max:5',
            'files.*' => ['file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120', new \App\Rules\ValidFileMagicBytes], // 5MB
            'is_anonymous' => 'nullable|boolean',
            'recaptcha_token' => 'nullable|string',
            'guest_token' => 'nullable|string',
        ];

        if (!$isAnonymous) {
            $rules['name'] = 'required|string|max:100';
            $rules['email'] = 'nullable|email|max:255';
            $rules['phone'] = ['nullable', 'string', 'regex:/^(\+?[0-9]{7,15})$/'];
            $rules['national_id'] = 'nullable|string|digits:11';
            $rules['dob'] = 'nullable|date';
        }

        $validator = Validator::make($request->all(), $rules, [
            'name.required' => 'الاسم مطلوب',
            'name.max' => 'الاسم يجب ألا يتجاوز 100 حرف',
            'description.required' => 'الوصف مطلوب',
            'description.min' => 'الوصف يجب أن يكون على الأقل 10 أحرف',
            'description.max' => 'الوصف يجب ألا يتجاوز 5000 حرف',
            'directorate_id.required' => 'يجب تحديد الجهة المستلمة | Please select a recipient directorate',
            'directorate_id.exists' => 'الجهة المحددة غير صالحة | The selected directorate is invalid',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'phone.regex' => 'رقم الهاتف غير صالح',
            'national_id.digits' => 'الرقم الوطني يجب أن يتكون من 11 رقماً',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Additional file validation
        $files = $request->file('files', []);

        // Bug #316: Resolve pre-uploaded temp attachment IDs to files
        $attachmentIds = $request->input('attachment_ids', []);
        if (!empty($attachmentIds) && is_array($attachmentIds)) {
            foreach ($attachmentIds as $tempId) {
                $metadata = \Illuminate\Support\Facades\Cache::get("temp_attachment_{$tempId}");
                if ($metadata && \Illuminate\Support\Facades\Storage::disk('public')->exists($metadata['path'])) {
                    $fullPath = \Illuminate\Support\Facades\Storage::disk('public')->path($metadata['path']);
                    $files[] = new \Illuminate\Http\UploadedFile(
                        $fullPath,
                        $metadata['original_name'],
                        $metadata['mime_type'],
                        null,
                        true
                    );
                    \Illuminate\Support\Facades\Cache::forget("temp_attachment_{$tempId}");
                }
            }
        }
        $fileErrors = $this->suggestionService->validateFiles($files);

        if (!empty($fileErrors)) {
            return response()->json([
                'success' => false,
                'errors' => ['files' => $fileErrors]
            ], 422);
        }

        try {
            $data = $request->only(['name', 'email', 'phone', 'description', 'national_id', 'dob', 'directorate_id']);
            $data['is_anonymous'] = $isAnonymous;

            // Sanitize string inputs
            if (isset($data['name'])) {
                $data['name'] = strip_tags(trim($data['name']));
            }
            if (isset($data['description'])) {
                $data['description'] = strip_tags($data['description']);
            }

            $suggestion = $this->suggestionService->store(
                $data,
                $files
            );

            // Send notification to authenticated user
            if (auth()->check()) {
                auth()->user()->notify(new SuggestionSubmitted($suggestion));
            }

            // FR-70: Notify staff about new suggestion
            try {
                $this->notificationService->notifyNewSuggestion($suggestion);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to notify staff about new suggestion: {$e->getMessage()}");
            }

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
     * T-SRS2-11: Notify submitter on status change
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
            'response' => 'nullable|string|max:2000', // FR-45: Optional response message
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $suggestion = Suggestion::findOrFail($id);
        $this->authorize('changeStatus', $suggestion);

        $oldStatus = $suggestion->status;
        $newStatus = $request->status;

        // Only proceed if status actually changed
        if ($oldStatus === $newStatus && !$request->filled('response')) {
            return response()->json([
                'success' => true,
                'message' => 'No changes made',
                'data' => $suggestion
            ]);
        }

        // Update status with response (FR-45)
        $suggestion->updateStatus(
            $newStatus,
            auth()->id(),
            $request->input('response')
        );

        // Log the action
        $this->auditService->log(
            auth()->user(),
            'suggestion_status_updated',
            'suggestion',
            $suggestion->id,
            ['old_status' => $oldStatus, 'new_status' => $suggestion->status]
        );

        // T-SRS2-11: Notify submitter if status changed
        if ($oldStatus !== $newStatus) {
            try {
                $this->notificationService->notifySuggestionStatusChange($suggestion, $oldStatus, $newStatus);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to notify suggestion status change: {$e->getMessage()}");
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Suggestion status updated successfully',
            'data' => $suggestion->fresh()
        ]);
    }

    /**
     * Delete suggestion (admin only)
     */
    public function destroy(string $id): JsonResponse
    {
        $suggestion = Suggestion::findOrFail($id);
        $this->authorize('delete', $suggestion);

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

    /**
     * Get authenticated user's suggestions
     */
    public function mySuggestions(Request $request): JsonResponse
    {
        $query = Suggestion::where('user_id', auth()->id())
            ->with('attachments')
            ->latest();

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $suggestions = $query->get()->map(function ($suggestion) {
            return [
                'id' => $suggestion->id,
                'tracking_number' => $suggestion->tracking_number,
                'description' => $suggestion->description,
                'status' => $suggestion->status,
                'status_label' => $this->getStatusLabel($suggestion->status),
                'created_at' => $suggestion->created_at->toIso8601String(),
                'updated_at' => $suggestion->updated_at->toIso8601String(),
                'response' => $suggestion->response,
                'reviewed_at' => $suggestion->reviewed_at?->toIso8601String(),
                'attachments_count' => $suggestion->attachments->count(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $suggestions
        ]);
    }

    /**
     * FR-55: Track suggestion status by tracking number (public endpoint)
     */
    public function track(Request $request, string $trackingNumber): JsonResponse
    {
        $suggestion = Suggestion::where('tracking_number', $trackingNumber)
            ->with('directorate')
            ->first();

        if (!$suggestion) {
            return response()->json([
                'success' => false,
                'message' => 'Suggestion not found'
            ], 404);
        }

        // For non-anonymous suggestions, verify national_id if provided
        $nationalId = $request->query('national_id');
        if ($nationalId && !$suggestion->is_anonymous) {
            if ($suggestion->national_id && $suggestion->national_id !== $nationalId) {
                return response()->json([
                    'success' => false,
                    'message' => 'الرقم الوطني غير مطابق',
                    'message_en' => 'National ID does not match',
                ], 403);
            }
        }

        // Check if this suggestion has already been rated
        $existingRating = \App\Models\SuggestionRating::where('tracking_number', $suggestion->tracking_number)->first();

        // Bug #274 fix: Return full suggestion details for tracking display
        $directorate = $suggestion->directorate;
        $directorateName = null;
        if ($directorate) {
            $directorateName = $directorate->name_ar ?? $directorate->name_en ?? $directorate->name ?? null;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'tracking_number' => $suggestion->tracking_number,
                'status' => $suggestion->status,
                'description' => $suggestion->description,
                'created_at' => $suggestion->created_at->toIso8601String(),
                'submitted_at' => $suggestion->created_at->toIso8601String(),
                'last_updated' => $suggestion->updated_at->toIso8601String(),
                'response' => $suggestion->status !== Suggestion::STATUS_PENDING ? $suggestion->response : null,
                'reviewed_at' => $suggestion->reviewed_at?->toIso8601String(),
                'is_anonymous' => (bool) $suggestion->is_anonymous,
                'full_name' => $suggestion->is_anonymous ? null : $suggestion->name,
                'directorate' => $suggestion->directorate ? [
                    'name_ar' => $suggestion->directorate->name_ar,
                    'name_en' => $suggestion->directorate->name_en,
                ] : null,
                'category' => $suggestion->ai_category,
                'rating' => $existingRating?->rating,
                'directorate_name' => $directorateName,
                'directorate' => $directorate ? [
                    'name_ar' => $directorate->name_ar ?? $directorate->name ?? null,
                    'name_en' => $directorate->name_en ?? $directorate->name ?? null,
                ] : null,
                'category' => $suggestion->ai_category ?? null,
            ]
        ]);
    }

    /**
     * T-SRS2-10: Print view for suggestion (public endpoint)
     */
    public function printView(string $trackingNumber): JsonResponse
    {
        $suggestion = Suggestion::where('tracking_number', $trackingNumber)
            ->with('attachments')
            ->first();

        if (!$suggestion) {
            return response()->json([
                'success' => false,
                'message' => 'Suggestion not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'tracking_number' => $suggestion->tracking_number,
                'name' => $suggestion->name,
                'job_title' => $suggestion->job_title,
                'email' => $suggestion->email,
                'phone' => $suggestion->phone,
                'description' => $suggestion->description,
                'status' => $suggestion->status,
                'status_label' => $this->getStatusLabel($suggestion->status),
                'submitted_at' => $suggestion->created_at->toIso8601String(),
                'response' => $suggestion->response,
                'reviewed_at' => $suggestion->reviewed_at?->toIso8601String(),
                'attachments_count' => $suggestion->attachments->count(),
            ]
        ]);
    }

    /**
     * Get human-readable status label
     */
    protected function getStatusLabel(string $status): array
    {
        $labels = [
            Suggestion::STATUS_PENDING => [
                'ar' => 'قيد المراجعة',
                'en' => 'Pending Review'
            ],
            Suggestion::STATUS_REVIEWED => [
                'ar' => 'تمت المراجعة',
                'en' => 'Reviewed'
            ],
            Suggestion::STATUS_APPROVED => [
                'ar' => 'تمت الموافقة',
                'en' => 'Approved'
            ],
            Suggestion::STATUS_REJECTED => [
                'ar' => 'مرفوض',
                'en' => 'Rejected'
            ],
        ];

        return $labels[$status] ?? ['ar' => $status, 'en' => $status];
    }
}
