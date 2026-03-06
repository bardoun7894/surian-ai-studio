<?php

namespace App\Services;

use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ComplaintService
{
    protected AIService $aiService;
    protected NotificationService $notificationService;

    public function __construct(AIService $aiService, NotificationService $notificationService)
    {
        $this->aiService = $aiService;
        $this->notificationService = $notificationService;
    }

    public function createComplaint(array $data, array $files = []): Complaint
    {
        $complaint = DB::transaction(function () use ($data, $files) {
            $trackingNumber = $this->generateTrackingNumber();

            $complaint = Complaint::create(array_merge($data, [
                'tracking_number' => $trackingNumber,
                'status' => 'new',
                'priority' => 'medium', // Default, updated by AI
            ]));

            foreach ($files as $file) {
                if ($file instanceof UploadedFile) {
                    $this->storeAttachment($complaint, $file);
                }
            }

            return $complaint;
        });

        // FR-19: AI Classification (outside transaction — non-critical)
        $this->classifyWithAI($complaint);

        // FR-44: Notify staff about new complaint (outside transaction — non-critical)
        try {
            $this->notificationService->notifyNewComplaint($complaint);
        } catch (\Exception $e) {
            Log::error("Failed to send notifications for complaint #{$complaint->tracking_number}: {$e->getMessage()}");
        }

        return $complaint;
    }

    /**
     * Classify complaint using AI service (FR-19)
     */
    protected function classifyWithAI(Complaint $complaint): void
    {
        try {
            $analysis = $this->aiService->classifyComplaint($complaint);

            // Prepare update data
            $updateData = [];

            // AI Summary
            if (isset($analysis['summary'])) {
                $updateData['ai_summary'] = $analysis['summary'];
            }

            // AI Category
            if (isset($analysis['category'])) {
                $updateData['ai_category'] = $analysis['category'];
            }

            // AI Priority (also update the actual priority if high or urgent)
            if (isset($analysis['priority'])) {
                $updateData['ai_priority'] = $analysis['priority'];

                // Auto-set priority for high/urgent cases
                if (in_array($analysis['priority'], ['high', 'urgent'])) {
                    $updateData['priority'] = $analysis['priority'];
                }
            }

            // AI Keywords
            if (isset($analysis['keywords'])) {
                $updateData['ai_keywords'] = is_array($analysis['keywords'])
                    ? $analysis['keywords']
                    : explode(',', $analysis['keywords']);
            }

            // AI Confidence Score
            if (isset($analysis['confidence'])) {
                $updateData['ai_confidence'] = (float) $analysis['confidence'];
            }

            // AI Suggested Directorate
            if (isset($analysis['suggested_directorate_id'])) {
                $updateData['ai_suggested_directorate_id'] = $analysis['suggested_directorate_id'];
            }

            // Auto-reject if AI determines text is invalid/gibberish
            if (isset($analysis['is_valid']) && $analysis['is_valid'] === false) {
                $updateData['status'] = 'rejected';
                $updateData['priority'] = 'low';
                Log::info("Complaint #{$complaint->tracking_number} auto-rejected: invalid/unintelligible text");
            }

            // Update complaint with AI analysis
            if (!empty($updateData)) {
                $complaint->update($updateData);
            }

            Log::info("Complaint #{$complaint->tracking_number} classified by AI", [
                'category' => $analysis['category'] ?? 'unknown',
                'priority' => $analysis['priority'] ?? 'medium',
                'confidence' => $analysis['confidence'] ?? 0,
                'is_valid' => $analysis['is_valid'] ?? true,
                'suggested_directorate' => $analysis['suggested_directorate_id'] ?? null,
            ]);
        } catch (\Exception $e) {
            Log::error("AI classification failed for complaint #{$complaint->tracking_number}: {$e->getMessage()}");
            // Complaint will keep default values, which is acceptable
        }
    }

    protected function generateTrackingNumber(): string
    {
        // Format: YYYYMMDD-XXXX (e.g. 20240520-A1B2)
        $date = Carbon::now()->format('Ymd');
        
        do {
            $random = strtoupper(Str::random(4));
            $number = "{$date}-{$random}";
        } while (Complaint::where('tracking_number', $number)->exists());

        return $number;
    }

    protected function storeAttachment(Complaint $complaint, UploadedFile $file): ComplaintAttachment
    {
        // Store with a randomized filename to prevent path traversal and enumeration
        $extension = $file->getClientOriginalExtension();
        $safeName = Str::uuid() . '.' . $extension;
        $path = $file->storeAs('complaints/' . $complaint->id, $safeName, 'public');

        return ComplaintAttachment::create([
            'complaint_id' => $complaint->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);
    }
}
