<?php

namespace App\Services;

use App\Models\Suggestion;
use App\Models\SuggestionAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SuggestionService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Store a new suggestion with file attachments
     */
    public function store(array $data, array $files = []): Suggestion
    {
        $suggestion = DB::transaction(function () use ($data, $files) {
            // Create the suggestion
            $suggestion = Suggestion::create([
                'name' => $data['name'] ?? 'مجهول الهوية',
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'national_id' => $data['national_id'] ?? null,
                'dob' => $data['dob'] ?? null,
                'directorate_id' => $data['directorate_id'] ?? null,
                'is_anonymous' => $data['is_anonymous'] ?? false,
                'description' => $data['description'],
                'status' => Suggestion::STATUS_PENDING,
                'user_id' => auth()->id(),
            ]);

            // Handle file uploads
            if (!empty($files)) {
                $this->storeAttachments($suggestion, $files);
            }

            return $suggestion->load('attachments');
        });

        // AI Classification (outside transaction — non-critical)
        $this->classifyWithAI($suggestion);

        return $suggestion;
    }

    /**
     * Classify suggestion using AI service
     */
    protected function classifyWithAI(Suggestion $suggestion): void
    {
        try {
            $analysis = $this->aiService->classifySuggestion($suggestion);

            $updateData = [];

            if (isset($analysis['summary'])) {
                $updateData['ai_summary'] = $analysis['summary'];
            }
            if (isset($analysis['category'])) {
                $updateData['ai_category'] = $analysis['category'];
            }
            if (isset($analysis['priority'])) {
                $updateData['ai_priority'] = $analysis['priority'];
            }
            if (isset($analysis['keywords'])) {
                $updateData['ai_keywords'] = is_array($analysis['keywords'])
                    ? $analysis['keywords']
                    : explode(',', $analysis['keywords']);
            }
            if (isset($analysis['confidence'])) {
                $updateData['ai_confidence'] = (float) $analysis['confidence'];
            }
            if (isset($analysis['suggested_directorate_id'])) {
                if (\App\Models\Directorate::where('id', $analysis['suggested_directorate_id'])->exists()) {
                    $updateData['ai_suggested_directorate_id'] = $analysis['suggested_directorate_id'];
                }
            }

            if (!empty($updateData)) {
                $suggestion->update($updateData);
            }

            Log::info("Suggestion #{$suggestion->tracking_number} classified by AI", [
                'category' => $analysis['category'] ?? 'unknown',
                'priority' => $analysis['priority'] ?? 'medium',
                'confidence' => $analysis['confidence'] ?? 0,
            ]);
        } catch (\Exception $e) {
            Log::error("AI classification failed for suggestion #{$suggestion->tracking_number}: {$e->getMessage()}");
            // Reset PostgreSQL connection state after failed transaction
            try {
                \Illuminate\Support\Facades\DB::reconnect();
            } catch (\Exception $reconnectEx) {
                // Ignore reconnect failures
            }
        }
    }

    /**
     * Store file attachments for a suggestion
     */
    protected function storeAttachments(Suggestion $suggestion, array $files): void
    {
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $path = $file->store('suggestions', 'public');
                
                SuggestionAttachment::create([
                    'suggestion_id' => $suggestion->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                    'uploaded_at' => now(),
                ]);
            }
        }
    }

    /**
     * Find a suggestion by tracking number
     */
    public function findByTrackingNumber(string $trackingNumber): ?Suggestion
    {
        return Suggestion::where('tracking_number', $trackingNumber)
            ->with('attachments')
            ->first();
    }

    /**
     * Update suggestion status
     */
    public function updateStatus(Suggestion $suggestion, string $status): Suggestion
    {
        $suggestion->update(['status' => $status]);
        
        return $suggestion->fresh();
    }

    /**
     * Delete suggestion attachments from storage
     */
    public function deleteAttachments(Suggestion $suggestion): void
    {
        foreach ($suggestion->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
        }
    }

    /**
     * Validate file uploads
     */
    public function validateFiles(array $files): array
    {
        $errors = [];
        $maxFiles = 5;
        $maxSize = 10 * 1024 * 1024; // 10MB in bytes
        $allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

        if (count($files) > $maxFiles) {
            $errors[] = "Maximum {$maxFiles} files allowed";
        }

        foreach ($files as $index => $file) {
            if ($file instanceof UploadedFile) {
                if ($file->getSize() > $maxSize) {
                    $errors[] = "File {$file->getClientOriginalName()} exceeds 10MB limit";
                }

                $extension = strtolower($file->getClientOriginalExtension());
                if (!in_array($extension, $allowedTypes)) {
                    $errors[] = "File {$file->getClientOriginalName()} has invalid type. Allowed: " . implode(', ', $allowedTypes);
                }
            }
        }

        return $errors;
    }
}
