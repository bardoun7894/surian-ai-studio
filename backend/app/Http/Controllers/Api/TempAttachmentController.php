<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Bug #316: Temporary attachment upload endpoint.
 * Files are uploaded immediately on selection and stored in a temp directory.
 * Returned attachment IDs are sent with the form on submit.
 * Unused attachments are cleaned up after 24h by the CleanupTempAttachments command.
 */
class TempAttachmentController extends Controller
{
    /**
     * Upload a single temporary attachment.
     * POST /api/v1/attachments/temp
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB
            'context' => 'nullable|string|in:complaint,suggestion',
        ]);

        $file = $request->file('file');
        $tempId = Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();
        $filename = "{$tempId}.{$extension}";

        // Store in a temp directory
        $path = $file->storeAs('temp-attachments', $filename, 'public');

        // Store metadata in cache for 24h
        $metadata = [
            'id' => $tempId,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'context' => $request->input('context', 'complaint'),
            'uploaded_at' => now()->toIso8601String(),
            'user_id' => auth()->id(),
            'ip' => $request->ip(),
        ];

        \Illuminate\Support\Facades\Cache::put("temp_attachment_{$tempId}", $metadata, 86400); // 24h

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $tempId,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ],
        ], 201);
    }

    /**
     * Delete a temporary attachment.
     * DELETE /api/v1/attachments/temp/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $metadata = \Illuminate\Support\Facades\Cache::get("temp_attachment_{$id}");

        if (!$metadata) {
            return response()->json(['success' => false, 'message' => 'Attachment not found'], 404);
        }

        // Delete the file
        if (Storage::disk('public')->exists($metadata['path'])) {
            Storage::disk('public')->delete($metadata['path']);
        }

        // Remove cache entry
        \Illuminate\Support\Facades\Cache::forget("temp_attachment_{$id}");

        return response()->json(['success' => true, 'message' => 'Attachment deleted']);
    }
}
