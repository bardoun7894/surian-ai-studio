<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromotionalSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PromotionalSectionController extends Controller
{
    public function index(Request $request)
    {
        $query = PromotionalSection::latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%");
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $sections = $query->paginate(20);
        return view('admin.promotional-sections.index', compact('sections'));
    }

    public function create()
    {
        return view('admin.promotional-sections.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'button_text_ar' => 'nullable|string|max:255',
            'button_text_en' => 'nullable|string|max:255',
            'button_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_file' => 'nullable|mimetypes:video/mp4,video/webm,video/ogg|max:51200',
            'video_url' => 'nullable|string|max:500',
            'background_color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:50',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active');

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('promotional', 'public');
        } else {
            unset($validated['image']);
        }

        // Handle video file upload — takes priority over video_url
        if ($request->hasFile('video_file')) {
            $validated['video_url'] = '/storage/' . $request->file('video_file')->store('promotional/videos', 'public');
        }
        unset($validated['video_file']);

        PromotionalSection::create($validated);
        return redirect()->route('admin.promotional.index')->with('success', 'تم إنشاء القسم الترويجي بنجاح');
    }

    public function edit(PromotionalSection $section)
    {
        return view('admin.promotional-sections.edit', compact('section'));
    }

    public function update(Request $request, PromotionalSection $section)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'button_text_ar' => 'nullable|string|max:255',
            'button_text_en' => 'nullable|string|max:255',
            'button_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_file' => 'nullable|mimetypes:video/mp4,video/webm,video/ogg|max:51200',
            'video_url' => 'nullable|string|max:500',
            'background_color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:50',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active');

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($section->image && !str_starts_with($section->image, 'http')) {
                Storage::disk('public')->delete($section->image);
            }
            $validated['image'] = $request->file('image')->store('promotional', 'public');
        } else {
            unset($validated['image']);
        }

        // Handle video file upload — takes priority over video_url text input
        if ($request->hasFile('video_file')) {
            // Delete old uploaded video if it was a local file
            if ($section->video_url && str_starts_with($section->video_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $section->video_url));
            }
            $validated['video_url'] = '/storage/' . $request->file('video_file')->store('promotional/videos', 'public');
        }
        unset($validated['video_file']);

        $section->update($validated);
        return redirect()->route('admin.promotional.index')->with('success', 'تم تحديث القسم الترويجي بنجاح');
    }

    public function destroy(PromotionalSection $section)
    {
        // Clean up uploaded files
        if ($section->image && !str_starts_with($section->image, 'http')) {
            Storage::disk('public')->delete($section->image);
        }
        if ($section->video_url && str_starts_with($section->video_url, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $section->video_url));
        }

        $section->delete();
        return redirect()->route('admin.promotional.index')->with('success', 'تم حذف القسم الترويجي بنجاح');
    }
}
