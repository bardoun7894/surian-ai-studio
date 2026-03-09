<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Directorate;
use App\Services\AIService;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function index(Request $request)
    {
        $query = Content::with(['author', 'directorate']);

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
        $directorates = Directorate::where('is_active', true)->get();
        return view('admin.content.create', compact('categories', 'directorates'));
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
            'image' => 'nullable|image|max:5120',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|max:5120',
            'tags' => 'nullable|string',
            'directorate_id' => 'nullable|string|exists:directorates,id',
            'video_file' => 'nullable|mimetypes:video/mp4,video/webm,video/ogg|max:51200',
            'video_url' => 'nullable|string|max:500',
            // Ticker fields
            'show_in_ticker' => 'nullable|boolean',
            'ticker_duration' => 'nullable|string|in:24h,48h,1w,1m',
            // Service specific fields (optional)
            'service_requirements' => 'nullable|string',
            'service_fees' => 'nullable|string',
            'service_duration' => 'nullable|string',
        ]);

        $data = $validated;
        unset($data['video_file'], $data['video_url']);
        $data['slug'] = \Illuminate\Support\Str::slug($validated['title_ar']) . '-' . uniqid();
        $data['author_id'] = auth()->id();

        // Handle ticker fields
        $data['show_in_ticker'] = $request->has('show_in_ticker') ? true : false;
        if ($data['show_in_ticker'] && $request->filled('ticker_duration')) {
            $data['ticker_start_at'] = now();
        } else {
            $data['show_in_ticker'] = false;
            $data['ticker_duration'] = null;
            $data['ticker_start_at'] = null;
        }

        // Clear directorate_id if category is not news
        if ($data['category'] !== Content::CATEGORY_NEWS) {
            unset($data['directorate_id']);
        }

        // Prepare metadata
        $metadata = [];

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = '/storage/' . $image->store('content', 'public');
            }
            $metadata['images'] = $imagePaths;
            $metadata['image'] = $imagePaths[0];
        } elseif ($request->hasFile('image')) {
            $path = '/storage/' . $request->file('image')->store('content', 'public');
            $metadata['image'] = $path;
        }

        // Handle video upload
        if ($request->hasFile('video_file')) {
            $videoPath = '/storage/' . $request->file('video_file')->store('content/videos', 'public');
            $metadata['video_url'] = $videoPath;
        } elseif ($request->filled('video_url')) {
            $metadata['video_url'] = $request->input('video_url');
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
        $directorates = Directorate::where('is_active', true)->get();
        return view('admin.content.edit', compact('content', 'categories', 'directorates'));
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
            'image' => 'nullable|image|max:5120',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|max:5120',
            'tags' => 'nullable|string',
            'directorate_id' => 'nullable|string|exists:directorates,id',
            'video_file' => 'nullable|mimetypes:video/mp4,video/webm,video/ogg|max:51200',
            'video_url' => 'nullable|string|max:500',
            // Ticker fields
            'show_in_ticker' => 'nullable|boolean',
            'ticker_duration' => 'nullable|string|in:24h,48h,1w,1m',
            'service_requirements' => 'nullable|string',
            'service_fees' => 'nullable|string',
            'service_duration' => 'nullable|string',
        ]);

        $data = $validated;
        unset($data['video_file'], $data['video_url']);

        // Clear directorate_id if category is not news
        if ($data['category'] !== Content::CATEGORY_NEWS) {
            $data['directorate_id'] = null;
        }

        // Handle ticker fields
        $data['show_in_ticker'] = $request->has('show_in_ticker') ? true : false;
        if ($data['show_in_ticker'] && $request->filled('ticker_duration')) {
            // Reset ticker_start_at on every save so new duration starts from now
            $data['ticker_start_at'] = now();
        } else {
            $data['show_in_ticker'] = false;
            $data['ticker_duration'] = null;
            $data['ticker_start_at'] = null;
        }

        // Prepare metadata - Start with existing
        $metadata = $content->metadata ?? [];

        // Handle removal of existing images
        if ($request->has('remove_images')) {
            $removeImages = $request->input('remove_images', []);
            $currentImages = $metadata['images'] ?? [];
            $currentImages = array_values(array_filter($currentImages, fn($img) => !in_array($img, $removeImages)));
            $metadata['images'] = $currentImages;
            $metadata['image'] = $currentImages[0] ?? null;
        }

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = '/storage/' . $image->store('content', 'public');
            }
            $metadata['images'] = $imagePaths;
            $metadata['image'] = $imagePaths[0];
        } elseif ($request->hasFile('image')) {
            $path = '/storage/' . $request->file('image')->store('content', 'public');
            $metadata['image'] = $path;
        }

        // Handle video upload
        if ($request->hasFile('video_file')) {
            $videoPath = '/storage/' . $request->file('video_file')->store('content/videos', 'public');
            $metadata['video_url'] = $videoPath;
        } elseif ($request->filled('video_url')) {
            $metadata['video_url'] = $request->input('video_url');
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

        // News ticker settings
        if ($data['category'] === 'news') {
            if ($request->has('ticker_enabled')) {
                $oldDuration = $metadata['ticker_duration'] ?? null;
                $newDuration = (int) $request->input('ticker_duration', 24);
                $metadata['ticker_enabled'] = true;
                $metadata['ticker_duration'] = $newDuration;
                // Reset timer when duration changes or newly enabled
                if (!isset($metadata['ticker_starts_at']) || $oldDuration !== $newDuration) {
                    $metadata['ticker_starts_at'] = now()->toIso8601String();
                }
            } else {
                $metadata['ticker_enabled'] = false;
                unset($metadata['ticker_starts_at']);
            }
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
