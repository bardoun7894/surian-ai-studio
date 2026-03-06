<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StagedUpload;
use App\Services\VirusScanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/**
 * M1-T3: Staging endpoint for immediate file upload on selection.
 * Files are stored temporarily and referenced by UUID on form submission.
 */
class StagedUploadController extends Controller
{
    public function __construct(
        protected VirusScanService $virusScanService
    ) {}

    /**
     * POST /api/v1/attachments/stage
     *
     * Accepts a single file, validates, virus-scans, stores it,
     * and returns a UUID that the frontend sends with the form later.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,pdf,doc,docx',
                'max:5120', // 5 MB
                new \App\Rules\ValidFileMagicBytes,
            ],
            'context' => 'nullable|string|in:complaint,suggestion',
            'session_token' => 'required|string|size:64',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Enforce max staged files per session (5)
        $sessionToken = $request->input('session_token');
        $context = $request->input('context', 'complaint');
        $existingCount = StagedUpload::available($sessionToken)
            ->where('context', $context)
            ->count();

        if ($existingCount >= 5) {
            return response()->json([
                'message' => 'Maximum 5 staged files allowed per session.',
            ], 422);
        }

        $file = $request->file('file');

        // Virus scan
        $infected = $this->virusScanService->scanFiles([$file]);
        if (!empty($infected)) {
            return response()->json([
                'message' => 'Potentially malicious file detected.',
            ], 422);
        }

        // Store to a staging directory with a random name
        $extension = $file->getClientOriginalExtension();
        $safeName = Str::uuid() . '.' . $extension;
        $path = $file->storeAs('staging/' . substr($sessionToken, 0, 8), $safeName, 'public');

        $staged = StagedUpload::create([
            'session_token' => $sessionToken,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'context' => $context,
            'expires_at' => now()->addHours(24),
        ]);

        return response()->json([
            'id' => $staged->id,
            'file_name' => $staged->file_name,
            'size' => $staged->size,
            'mime_type' => $staged->mime_type,
        ], 201);
    }

    /**
     * DELETE /api/v1/attachments/stage/{id}
     *
     * Allows the user to remove a staged file before submitting.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $sessionToken = $request->input('session_token') ?? $request->header('X-Session-Token');

        if (!$sessionToken) {
            return response()->json(['message' => 'Session token required.'], 422);
        }

        $staged = StagedUpload::where('id', $id)
            ->where('session_token', $sessionToken)
            ->where('claimed', false)
            ->first();

        if (!$staged) {
            return response()->json(['message' => 'Staged file not found.'], 404);
        }

        // Delete the physical file
        if (Storage::disk('public')->exists($staged->file_path)) {
            Storage::disk('public')->delete($staged->file_path);
        }

        $staged->delete();

        return response()->json(['message' => 'Staged file removed.']);
    }
}
