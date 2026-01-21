<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Services\AIService;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function index(Request $request)
    {
        $query = Content::with('author');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'ilike', "%{$search}%")
                  ->orWhere('title_en', 'ilike', "%{$search}%")
                  ->orWhere('content_ar', 'ilike', "%{$search}%")
                  ->orWhere('content_en', 'ilike', "%{$search}%")
                  ->orWhere('id', '=', is_numeric($search) ? $search : 0);
            });
        }

        $contents = $query->latest()->paginate(10)->withQueryString();
        return view('admin.content.index', compact('contents'));
    }
    
    public function create()
    {
        $categories = [
            Content::CATEGORY_NEWS => 'أخبار',
            Content::CATEGORY_ANNOUNCEMENT => 'إعلانات',
            Content::CATEGORY_DECREE => 'مراسيم وقرارات',
            Content::CATEGORY_SERVICE => 'خدمات',
            Content::CATEGORY_FAQ => 'أسئلة شائعة',
            Content::CATEGORY_ABOUT => 'من نحن',
            Content::CATEGORY_MEDIA => 'المركز الإعلامي',
        ];
        return view('admin.content.create', compact('categories'));
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'category' => 'required|string',
            'status' => 'required|in:draft,published,archived',
            'content_ar' => 'required|string',
            'content_en' => 'nullable|string',
            'published_at' => 'nullable|date',
            'image' => 'nullable|image|max:2048',
            'tags' => 'nullable|string',
            // Service specific fields (optional)
            'service_requirements' => 'nullable|string',
            'service_fees' => 'nullable|string',
            'service_duration' => 'nullable|string',
        ]);
        
        $data = $validated;
        $data['slug'] = \Illuminate\Support\Str::slug($validated['title_ar']);
        $data['author_id'] = auth()->id();
        
        // Prepare metadata
        $metadata = [];

        if ($request->hasFile('image')) {
            $metadata['image'] = $request->file('image')->store('content', 'public');
        }

        // Add service metadata if exists
        if ($request->filled('service_requirements')) $metadata['requirements'] = $request->service_requirements;
        if ($request->filled('service_fees')) $metadata['fees'] = $request->service_fees;
        if ($request->filled('service_duration')) $metadata['duration'] = $request->service_duration;
        
        $data['metadata'] = $metadata;
        
        if ($request->filled('tags')) {
            $data['tags'] = array_map('trim', explode(',', $request->tags));
        }

        Content::create($data);

        return redirect()->route('admin.content.index')->with('success', 'تم نشر المحتوى بنجاح');
    }

    public function edit(Content $content)
    {
        $categories = [
            Content::CATEGORY_NEWS => 'أخبار',
            Content::CATEGORY_ANNOUNCEMENT => 'إعلانات',
            Content::CATEGORY_DECREE => 'مراسيم وقرارات',
            Content::CATEGORY_SERVICE => 'خدمات',
            Content::CATEGORY_FAQ => 'أسئلة شائعة',
            Content::CATEGORY_ABOUT => 'من نحن',
            Content::CATEGORY_MEDIA => 'المركز الإعلامي',
        ];
        return view('admin.content.edit', compact('content', 'categories'));
    }

    public function update(Request $request, Content $content)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'category' => 'required|string',
            'status' => 'required|in:draft,published,archived',
            'content_ar' => 'required|string',
            'content_en' => 'nullable|string',
            'published_at' => 'nullable|date',
            'image' => 'nullable|image|max:2048',
            'tags' => 'nullable|string',
            'service_requirements' => 'nullable|string',
            'service_fees' => 'nullable|string',
            'service_duration' => 'nullable|string',
        ]);
        
        $data = $validated;
        
        // Prepare metadata - Start with existing
        $metadata = $content->metadata ?? [];
        
        if ($request->hasFile('image')) {
            $metadata['image'] = $request->file('image')->store('content', 'public');
        }

        // Update/Merge service metadata
        if ($request->filled('service_requirements')) {
            $metadata['requirements'] = $request->service_requirements;
        } elseif($request->category === 'service' && !$request->filled('service_requirements')) {
             unset($metadata['requirements']); // Remove if cleared
        }

        if ($request->filled('service_fees')) {
            $metadata['fees'] = $request->service_fees;
        } elseif($request->category === 'service' && !$request->filled('service_fees')) {
             unset($metadata['fees']);
        }

        if ($request->filled('service_duration')) {
            $metadata['duration'] = $request->service_duration;
        } elseif($request->category === 'service' && !$request->filled('service_duration')) {
             unset($metadata['duration']);
        }

        $data['metadata'] = $metadata;
        
        if ($request->filled('tags')) {
            $data['tags'] = array_map('trim', explode(',', $request->tags));
        }
        
        $content->update($data);
        
        return redirect()->route('admin.content.index')->with('success', 'تم تحديث المحتوى بنجاح');
    }
    
    public function destroy(Content $content)
    {
        $content->delete();
        return redirect()->route('admin.content.index')->with('success', 'تم حذف المحتوى بنجاح');
    }

    /**
     * Translate content using AI service
     */
    public function translate(Request $request, AIService $aiService)
    {
        $request->validate([
            'text' => 'required|string|max:50000',
            'source_lang' => 'required|in:ar,en',
            'target_lang' => 'required|in:ar,en',
        ]);

        $translated = $aiService->translate(
            $request->input('text'),
            $request->input('source_lang'),
            $request->input('target_lang')
        );

        if ($translated === null) {
            return response()->json([
                'success' => false,
                'message' => 'فشلت عملية الترجمة. يرجى المحاولة مرة أخرى.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'translated_text' => $translated,
            'source_lang' => $request->input('source_lang'),
            'target_lang' => $request->input('target_lang'),
        ]);
    }
}
