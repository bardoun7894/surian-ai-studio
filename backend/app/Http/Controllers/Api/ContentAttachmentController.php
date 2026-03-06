<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\ContentAttachment;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ContentAttachmentController extends Controller
{
    public function __construct(
        protected AuditService $auditService
    ) {}

    /**
     * FR-13: List all attachments for a content
     */
    public function index(int $contentId): JsonResponse
    {
        $content = Content::findOrFail($contentId);

        $attachments = $content->attachments()
            ->when(!auth()->check(), function ($query) {
                $query->where('is_public', true);
            })
            ->get();

        return response()->json([
            'attachments' => $attachments,
        ]);
    }

    /**
     * FR-13: Upload an attachment for content
     */
    public function store(Request $request, int $contentId): JsonResponse
    {
        $content = Content::findOrFail($contentId);

        $validator = Validator::make($request->all(), [
            'file' => ['required', 'file', 'max:51200', 'mimes:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,ppt,pptx,mp4,mp3,zip', new \App\Rules\ValidFileMagicBytes], // 50MB max
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'is_public' => 'boolean',
            'display_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $fileSize = $file->getSize();

        // Store file in content/{content_id}/attachments directory
        $filePath = $file->store("content/{$contentId}/attachments", 'public');

        // Detect file type
        $fileType = ContentAttachment::detectFileType($mimeType);

        // Get next display order if not provided
        $displayOrder = $request->input('display_order', $content->attachments()->max('display_order') + 1);

        $attachment = ContentAttachment::create([
            'content_id' => $contentId,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'mime_type' => $mimeType,
            'file_size' => $fileSize,
            'title_ar' => $request->input('title_ar'),
            'title_en' => $request->input('title_en'),
            'description_ar' => $request->input('description_ar'),
            'description_en' => $request->input('description_en'),
            'is_public' => $request->boolean('is_public', true),
            'display_order' => $displayOrder,
        ]);

        // Audit log
        $this->auditService->log(
            $request->user(),
            'content_attachment_uploaded',
            'content_attachment',
            $attachment->id,
            [
                'content_id' => $contentId,
                'file_name' => $fileName,
                'file_size' => $fileSize,
            ]
        );

        return response()->json([
            'message' => 'Attachment uploaded successfully',
            'attachment' => $attachment,
        ], 201);
    }

    /**
     * FR-13: Get a specific attachment
     */
    public function show(int $contentId, int $attachmentId): JsonResponse
    {
        $content = Content::findOrFail($contentId);
        $attachment = $content->attachments()->findOrFail($attachmentId);

        // Check if public or authenticated
        if (!$attachment->is_public && !auth()->check()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'attachment' => $attachment,
        ]);
    }

    /**
     * FR-13: Download an attachment
     */
    public function download(int $contentId, int $attachmentId)
    {
        $content = Content::findOrFail($contentId);
        $attachment = $content->attachments()->findOrFail($attachmentId);

        // Check if public or authenticated
        if (!$attachment->is_public && !auth()->check()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Increment download count
        $attachment->incrementDownloads();

        // Return file download
        return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);
    }

    /**
     * FR-13: Update attachment metadata
     */
    public function update(Request $request, int $contentId, int $attachmentId): JsonResponse
    {
        $content = Content::findOrFail($contentId);
        $attachment = $content->attachments()->findOrFail($attachmentId);

        $validator = Validator::make($request->all(), [
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'is_public' => 'boolean',
            'display_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $attachment->update($request->only([
            'title_ar',
            'title_en',
            'description_ar',
            'description_en',
            'is_public',
            'display_order',
        ]));

        // Audit log
        $this->auditService->log(
            $request->user(),
            'content_attachment_updated',
            'content_attachment',
            $attachment->id,
            [
                'content_id' => $contentId,
            ]
        );

        return response()->json([
            'message' => 'Attachment updated successfully',
            'attachment' => $attachment->fresh(),
        ]);
    }

    /**
     * FR-13: Delete an attachment
     */
    public function destroy(Request $request, int $contentId, int $attachmentId): JsonResponse
    {
        $content = Content::findOrFail($contentId);
        $attachment = $content->attachments()->findOrFail($attachmentId);

        // Delete file from storage
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        // Audit log
        $this->auditService->log(
            $request->user(),
            'content_attachment_deleted',
            'content_attachment',
            $attachment->id,
            [
                'content_id' => $contentId,
                'file_name' => $attachment->file_name,
            ]
        );

        $attachment->delete();

        return response()->json([
            'message' => 'Attachment deleted successfully',
        ]);
    }
}
