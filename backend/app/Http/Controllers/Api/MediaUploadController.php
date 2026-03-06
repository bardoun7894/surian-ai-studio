<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    /**
     * Upload a media item (video file, thumbnail, or YouTube URL).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title_ar'      => 'required|string|max:255',
            'title_en'      => 'nullable|string|max:255',
            'description_ar' => 'nullable|string|max:1000',
            'description_en' => 'nullable|string|max:1000',
            'media_type'    => 'required|in:video,photo,infographic',
            'video_file'    => 'nullable|file|mimes:mp4,webm,mov,avi,mkv|max:512000', // 500MB
            'thumbnail'     => 'nullable|file|mimes:jpg,jpeg,png,webp|max:10240',     // 10MB
            'image_file'    => 'nullable|file|mimes:jpg,jpeg,png,webp,gif|max:20480',  // 20MB (for photo type)
            'youtube_url'   => 'nullable|url',
            'duration'      => 'nullable|string|max:10',
            'count'         => 'nullable|integer|min:1',
        ]);

        $mediaType = $request->input('media_type');
        $metadata = ['media_type' => $mediaType];

        // Handle video: either file upload or YouTube URL
        if ($mediaType === 'video') {
            if ($request->hasFile('video_file')) {
                $videoFile = $request->file('video_file');
                $videoPath = $videoFile->store('media/videos', 'public');
                $metadata['url'] = Storage::disk('public')->url($videoPath);
                $metadata['file_path'] = $videoPath;
                $metadata['file_size'] = $videoFile->getSize();
                $metadata['mime_type'] = $videoFile->getMimeType();
            } elseif ($request->filled('youtube_url')) {
                $metadata['url'] = $request->input('youtube_url');
            }

            if ($request->filled('duration')) {
                $metadata['duration'] = $request->input('duration');
            }
        }

        // Handle photo type: image file upload
        if ($mediaType === 'photo') {
            if ($request->hasFile('image_file')) {
                $imageFile = $request->file('image_file');
                $imagePath = $imageFile->store('media/photos', 'public');
                $metadata['url'] = Storage::disk('public')->url($imagePath);
                $metadata['file_path'] = $imagePath;
            }
            if ($request->filled('count')) {
                $metadata['count'] = (int) $request->input('count');
            }
        }

        // Handle infographic type
        if ($mediaType === 'infographic') {
            if ($request->hasFile('image_file')) {
                $imageFile = $request->file('image_file');
                $imagePath = $imageFile->store('media/infographics', 'public');
                $metadata['url'] = Storage::disk('public')->url($imagePath);
                $metadata['file_path'] = $imagePath;
            }
        }

        // Handle thumbnail upload (for all types)
        if ($request->hasFile('thumbnail')) {
            $thumbFile = $request->file('thumbnail');
            $thumbPath = $thumbFile->store('media/thumbnails', 'public');
            $metadata['thumbnail'] = Storage::disk('public')->url($thumbPath);
        } elseif (isset($metadata['url']) && $mediaType !== 'video') {
            // For photos/infographics, use the image itself as thumbnail
            $metadata['thumbnail'] = $metadata['url'];
        } elseif ($request->filled('youtube_url')) {
            // Auto-generate YouTube thumbnail
            $ytId = $this->extractYouTubeId($request->input('youtube_url'));
            if ($ytId) {
                $metadata['thumbnail'] = "https://img.youtube.com/vi/{$ytId}/maxresdefault.jpg";
            }
        }

        // Fallback thumbnail
        if (empty($metadata['thumbnail'])) {
            $metadata['thumbnail'] = '/assets/media-placeholder.jpg';
        }

        $titleEn = $request->input('title_en', $request->input('title_ar'));

        $content = Content::create([
            'title_ar'          => $request->input('title_ar'),
            'title_en'          => $titleEn,
            'content_ar'        => $request->input('description_ar', $request->input('title_ar')),
            'content_en'        => $request->input('description_en', $titleEn),
            'seo_description_ar' => $request->input('description_ar', $request->input('title_ar')),
            'seo_description_en' => $request->input('description_en'),
            'slug'              => Str::slug($titleEn . '-' . uniqid()),
            'category'          => 'media',
            'status'            => 'published',
            'priority'          => 5,
            'published_at'      => now(),
            'metadata'          => $metadata,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم رفع المحتوى الإعلامي بنجاح',
            'data' => [
                'id'           => (string) $content->id,
                'title_ar'     => $content->title_ar,
                'title_en'     => $content->title_en,
                'type'         => $metadata['media_type'],
                'url'          => $metadata['url'] ?? null,
                'thumbnailUrl' => $metadata['thumbnail'],
            ],
        ], 201);
    }

    /**
     * Delete a media item.
     */
    public function destroy(string $id): JsonResponse
    {
        $content = Content::where('category', 'media')->findOrFail($id);

        // Delete associated files from storage
        if (!empty($content->metadata['file_path'])) {
            Storage::disk('public')->delete($content->metadata['file_path']);
        }
        if (!empty($content->metadata['thumbnail']) && str_starts_with($content->metadata['thumbnail'], '/storage/')) {
            $thumbPath = str_replace('/storage/', '', $content->metadata['thumbnail']);
            Storage::disk('public')->delete($thumbPath);
        }

        $content->delete();

        return response()->json(['success' => true, 'message' => 'تم حذف المحتوى الإعلامي']);
    }

    private function extractYouTubeId(string $url): ?string
    {
        if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/', $url, $match)) {
            return $match[1];
        }
        return null;
    }
}
