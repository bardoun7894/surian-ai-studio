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
     */
    public function index(Request $request)
    {
        $favorites = Favorite::where('user_id', Auth::id())
            ->when($request->type, function ($query, $type) {
                return $query->where('content_type', $type);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $favorites
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
