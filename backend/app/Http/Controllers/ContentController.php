<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    /**
     * Display a listing of the resource.
     * Public endpoint returns published content.
     * Admin endpoint returns all content with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Content::query();

        // If not admin, restrict to published content
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            $query->published();
        }

        // Filters
        if ($request->has('category')) {
            $query->category($request->category);
        }

        if ($request->has('type')) {
             $query->where('category', $request->type);
        }

        if ($request->has('status') && $request->user() && $request->user()->hasRole('admin')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%")
                  ->orWhere('content_ar', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 10);
        $content = $query->latest('published_at')->paginate($perPage);

        return response()->json($content);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'content_ar' => 'required|string',
            'content_en' => 'nullable|string',
            'category' => 'required|string|in:news,decree,announcement,service,faq,about,media',
            'status' => 'required|in:draft,published,archived',
            'featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title_ar']) . '-' . uniqid();
        
        if (!isset($validated['published_at']) && $validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $content = Content::create($validated);

        return response()->json($content, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $content = Content::with('author')->findOrFail($id);
        
        // Increment view count if public access
        if (!request()->user()) {
            $content->incrementViewCount();
        }

        return response()->json($content);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $content = Content::findOrFail($id);

        $validated = $request->validate([
            'title_ar' => 'sometimes|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'content_ar' => 'sometimes|string',
            'content_en' => 'nullable|string',
            'category' => 'sometimes|string|in:news,decree,announcement,service,faq,about,media',
            'status' => 'sometimes|in:draft,published,archived',
            'featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $content->update($validated);

        return response()->json($content);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $content = Content::findOrFail($id);
        
        // Soft delete
        $content->status = Content::STATUS_ARCHIVED;
        $content->save();
        $content->delete();

        return response()->json(['message' => 'Content archived successfully']);
    }
}
