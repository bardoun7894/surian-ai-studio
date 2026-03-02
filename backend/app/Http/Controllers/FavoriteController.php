<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     * Enriches favorites with bilingual titles from actual content models.
     */
    public function index(Request $request)
    {
        $favorites = Favorite::where('user_id', Auth::id())
            ->when($request->type, function ($query, $type) {
                return $query->where('content_type', $type);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Enrich favorites with bilingual data from actual content
        $enriched = $favorites->map(function ($fav) {
            $metadata = $fav->metadata ?? [];

            // Skip if already has bilingual data
            if (!empty($metadata['title_ar']) && !empty($metadata['title_en'])) {
                return $fav;
            }

            try {
                $type = $fav->content_type;
                $id = $fav->content_id;

                // Content-based types (news, announcement, decree, media)
                if (in_array($type, ['news', 'announcement', 'decree', 'decrees', 'media'])) {
                    $content = \App\Models\Content::find($id);
                    if ($content) {
                        $metadata['title_ar'] = $content->title_ar ?? $metadata['title'] ?? '';
                        $metadata['title_en'] = $content->title_en ?? $metadata['title'] ?? '';
                        $metadata['description_ar'] = $content->content_ar ?? $metadata['description'] ?? '';
                        $metadata['description_en'] = $content->content_en ?? $metadata['description'] ?? '';
                    }
                }

                // Service type
                if (in_array($type, ['service', 'services'])) {
                    $service = \App\Models\Service::find($id);
                    if ($service) {
                        $metadata['title_ar'] = $service->name_ar ?? $metadata['title'] ?? '';
                        $metadata['title_en'] = $service->name_en ?? $metadata['title'] ?? '';
                        $metadata['description_ar'] = $service->description_ar ?? $metadata['description'] ?? '';
                        $metadata['description_en'] = $service->description_en ?? $metadata['description'] ?? '';
                    }
                }

                // Law type
                if ($type === 'law') {
                    $content = \App\Models\Content::find($id);
                    if ($content) {
                        $metadata['title_ar'] = $content->title_ar ?? $metadata['title'] ?? '';
                        $metadata['title_en'] = $content->title_en ?? $metadata['title'] ?? '';
                        $metadata['description_ar'] = $content->content_ar ?? $metadata['description'] ?? '';
                        $metadata['description_en'] = $content->content_en ?? $metadata['description'] ?? '';
                    }
                }

                $fav->metadata = $metadata;
            } catch (\Exception $e) {
                Log::debug('Failed to enrich favorite', ['id' => $fav->id, 'error' => $e->getMessage()]);
            }

            return $fav;
        });

        return response()->json([
            'success' => true,
            'data' => $enriched
        ]);
    }

    /**
     * Store a newly created favorite.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content_type' => 'required|string',
            'content_id' => 'required|string',
            'metadata' => 'nullable|array',
        ]);

        // Check for soft-deleted favorite and restore it
        $existing = Favorite::withTrashed()
            ->where('user_id', Auth::id())
            ->where('content_type', $request->content_type)
            ->where('content_id', $request->content_id)
            ->first();

        if ($existing && $existing->trashed()) {
            $existing->restore();
            if ($request->has('metadata')) {
                $existing->update(['metadata' => $request->metadata]);
            }
            $favorite = $existing;
            Log::info('Favorite restored', ['user_id' => Auth::id(), 'content_type' => $request->content_type, 'content_id' => $request->content_id]);
        } elseif ($existing) {
            if ($request->has('metadata')) {
                $existing->update(['metadata' => $request->metadata]);
            }
            return response()->json([
                'success' => true,
                'data' => $existing,
                'message' => 'Already in favorites'
            ], 409);
        } else {
            $favorite = Favorite::create([
                'user_id' => Auth::id(),
                'content_type' => $request->content_type,
                'content_id' => $request->content_id,
                'metadata' => $request->metadata,
            ]);
            Log::info('Favorite added', ['user_id' => Auth::id(), 'content_type' => $request->content_type, 'content_id' => $request->content_id]);
        }

        return response()->json([
            'success' => true,
            'data' => $favorite,
            'message' => 'Added to favorites'
        ]);
    }

    /**
     * Remove the specified favorite.
     */
    public function destroy($type, $id)
    {
        $deleted = Favorite::where('user_id', Auth::id())
            ->where('content_type', $type)
            ->where('content_id', $id)
            ->delete();

        Log::info('Favorite removed', ['user_id' => Auth::id(), 'content_type' => $type, 'content_id' => $id]);

        return response()->json([
            'success' => true,
            'message' => $deleted ? 'Removed from favorites' : 'Favorite not found'
        ]);
    }

    /**
     * Check if specific items are favorited by the user.
     */
    public function check(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.content_type' => 'required|string',
            'items.*.content_id' => 'required|string',
        ]);

        $results = [];
        foreach ($request->items as $item) {
            $exists = Favorite::where('user_id', Auth::id())
                ->where('content_type', $item['content_type'])
                ->where('content_id', $item['content_id'])
                ->exists();
            
            $key = $item['content_type'] . '_' . $item['content_id'];
            $results[$key] = $exists;
        }

        return response()->json($results);
    }
}
