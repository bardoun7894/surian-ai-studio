<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StagedUploadController extends Controller
{
    /**
     * Stage a single file upload for later attachment to a complaint/suggestion.
     * Returns a temporary ID that can be sent with the final form submission.
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120|mimes:pdf,doc,docx,jpg,jpeg,png,gif,webp',
        ]);

        $file = $request->file('file');
        $tempId = Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();
        $filename = $tempId . '.' . $extension;

        // Store in temp directory
        $path = $file->storeAs('temp-uploads', $filename, 'local');

        return response()->json([
            'staged_id' => $tempId,
            'filename' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'path' => $path,
        ], 201);
    }

    /**
     * Delete a staged upload (user removed file before submitting).
     */
    public function destroy(string $stagedId)
    {
        // Find and delete the temp file
        $files = Storage::disk('local')->files('temp-uploads');
        foreach ($files as $file) {
            if (str_starts_with(basename($file), $stagedId)) {
                Storage::disk('local')->delete($file);
                return response()->json(['message' => 'Deleted'], 200);
            }
        }

        return response()->json(['message' => 'Not found'], 404);
    }
}
