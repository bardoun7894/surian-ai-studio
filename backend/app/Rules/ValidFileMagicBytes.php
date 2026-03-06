<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class ValidFileMagicBytes implements ValidationRule
{
    /**
     * Map of allowed MIME types detected via finfo (magic bytes)
     * to their corresponding allowed file extensions.
     */
    private const ALLOWED_MIME_EXTENSIONS = [
        'application/pdf' => ['pdf'],
        'application/msword' => ['doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => ['docx'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => ['xlsx'],
        'application/vnd.ms-excel' => ['xls'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => ['pptx'],
        'application/vnd.ms-powerpoint' => ['ppt'],
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png' => ['png'],
        'image/gif' => ['gif'],
        'image/webp' => ['webp'],
        'image/svg+xml' => ['svg'],
        'video/mp4' => ['mp4'],
        'audio/mpeg' => ['mp3'],
        // Office Open XML files may also be detected as zip
        'application/zip' => ['docx', 'xlsx', 'pptx', 'zip'],
        'application/x-zip-compressed' => ['docx', 'xlsx', 'pptx', 'zip'],
        'application/octet-stream' => ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value instanceof UploadedFile || !$value->isValid()) {
            return;
        }

        $filePath = $value->getRealPath();
        if (!$filePath || !file_exists($filePath)) {
            return;
        }

        // Detect real MIME type from file content using magic bytes
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->file($filePath);

        if ($detectedMime === false) {
            $fail('Unable to verify file type for :attribute.');
            return;
        }

        // Get the file extension from the client-provided name
        $extension = strtolower($value->getClientOriginalExtension());

        // Check if the detected MIME type is in our allowed list
        if (!isset(self::ALLOWED_MIME_EXTENSIONS[$detectedMime])) {
            $fail('The file :attribute has content that does not match any allowed file type.');
            return;
        }

        // Verify the extension matches what the magic bytes detected
        $allowedExtensions = self::ALLOWED_MIME_EXTENSIONS[$detectedMime];
        if (!in_array($extension, $allowedExtensions, true)) {
            $fail('The file :attribute extension does not match its actual content type.');
            return;
        }
    }
}
