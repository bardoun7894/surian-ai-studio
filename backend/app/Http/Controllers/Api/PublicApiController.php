<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ComplaintTemplate;
use App\Models\ContactSubmission;
use App\Models\Content;
use App\Models\Directorate;
use App\Models\Faq;
use App\Models\HappinessFeedback;
use App\Models\QuickLink;
use App\Models\Service;
use App\Models\SuggestionRating;
use App\Services\AIService;
use App\Services\VectorSearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PublicApiController extends Controller
{
    protected VectorSearchService $vectorSearch;
    protected AIService $aiService;

    public function __construct(VectorSearchService $vectorSearch, AIService $aiService)
    {
        $this->vectorSearch = $vectorSearch;
        $this->aiService = $aiService;
    }
    /**
     * Get all directorates
     */
    public function directorates(): JsonResponse
    {
        $directorates = Cache::remember('public.directorates', 600, function () {
            return Directorate::with(['subDirectorates' => function ($query) {
                $query->where('is_active', true)->orderBy('order');
            }])->withCount(['services' => function ($query) {
                $query->where('is_active', true);
            }])->get()->map(function ($d) {
                return [
                    'id' => (string) $d->id,
                    'name' => [
                        'ar' => $d->name_ar ?? $d->name,
                        'en' => $d->name_en ?? $d->name_ar ?? $d->name,
                    ], // Return localized object for better frontend support
                    'name_ar' => $d->name_ar ?? $d->name,
                    'name_en' => $d->name_en ?? $d->name,
                    'description' => $d->description_ar ?? $d->description ?? '',
                    'description_ar' => $d->description_ar ?? $d->description ?? '',
                    'description_en' => $d->description_en ?? $d->description ?? '',
                    'icon' => $d->icon ?? 'Building2',
                    'servicesCount' => $d->services_count,
                    'email' => $d->email,
                    'phone' => $d->phone,
                    'website' => $d->website,
                    'featured' => (bool) $d->featured,
                    'latitude' => $d->latitude,
                    'longitude' => $d->longitude,
                    'address_ar' => $d->address_ar ?? '',
                    'address_en' => $d->address_en ?? '',
                    'subDirectorates' => $d->subDirectorates->map(function ($sub) {
                        return [
                            'id' => (string) $sub->id,
                            'name' => [
                                'ar' => $sub->name_ar ?? $sub->name,
                                'en' => $sub->name_en ?? $sub->name_ar ?? $sub->name,
                            ],
                            'url' => $sub->url,
                            'isExternal' => (bool) $sub->is_external,
                        ];
                    }),
                ];
            })->values();
        });

        return response()->json($directorates);
    }

    /**
     * Get single directorate
     */
    public function directorate(string $id): JsonResponse
    {
        $directorate = Directorate::find($id);

        if (!$directorate) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $subDirectorates = $directorate->subDirectorates()
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($sub) {
                return [
                    'id' => (string) $sub->id,
                    'name' => [
                        'ar' => $sub->name_ar,
                        'en' => $sub->name_en ?? $sub->name_ar,
                    ],
                    'name_ar' => $sub->name_ar,
                    'name_en' => $sub->name_en ?? $sub->name_ar,
                    'description_ar' => $sub->description_ar ?? '',
                    'description_en' => $sub->description_en ?? '',
                    'phone' => $sub->phone ?? '',
                    'email' => $sub->email ?? '',
                    'address_ar' => $sub->address_ar ?? '',
                    'address_en' => $sub->address_en ?? '',
                    'url' => $sub->url,
                    'isExternal' => (bool) $sub->is_external,
                ];
            });

        $team = $directorate->team()
            ->orderBy('order')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => (string) $member->id,
                    'name' => $member->name_ar,
                    'name_ar' => $member->name_ar,
                    'name_en' => $member->name_en,
                    'position' => $member->position_ar,
                    'position_ar' => $member->position_ar,
                    'position_en' => $member->position_en,
                    'image' => $this->normalizeImageUrl($member->image),
                    'order' => $member->order,
                ];
            });

        // Calculate statistics for organizational structure display
        $servicesCount = $directorate->services()
            ->where('is_active', true)
            ->count();

        $newsCount = \App\Models\Content::where('category', 'news')
            ->where('status', 'published')
            ->where('directorate_id', $directorate->id)
            ->count();

        return response()->json([
            'id' => (string) $directorate->id,
            'name' => [
                'ar' => $directorate->name_ar ?? $directorate->name,
                'en' => $directorate->name_en ?? $directorate->name_ar ?? $directorate->name,
            ],
            'name_ar' => $directorate->name_ar ?? $directorate->name,
            'name_en' => $directorate->name_en ?? $directorate->name,
            'description' => [
                'ar' => $directorate->description_ar ?? $directorate->description ?? '',
                'en' => $directorate->description_en ?? $directorate->description ?? '',
            ],
            'description_ar' => $directorate->description_ar ?? $directorate->description ?? '',
            'description_en' => $directorate->description_en ?? $directorate->description ?? '',
            'icon' => $directorate->icon ?? 'Building2',
            'logo' => $this->normalizeImageUrl($directorate->logo_path),
            'subDirectorates' => $subDirectorates,
            'team' => $team,
            'servicesCount' => $servicesCount,
            'newsCount' => $newsCount,
            'email' => $directorate->email,
            'phone' => $directorate->phone,
            'website' => $directorate->website,
            'address_ar' => $directorate->address_ar,
            'address_en' => $directorate->address_en,
        ]);
    }

    /**
     * Get featured directorates (FR-49 to FR-51)
     * Returns 3 featured directorates with their sub-directorates
     */
    public function featuredDirectorates(): JsonResponse
    {
        $directorates = Cache::remember('public.featured_directorates', 600, function () {
            return Directorate::featured()
                ->with(['subDirectorates' => function ($query) {
                    $query->active()->ordered();
                }])
                ->get()
                ->map(function ($d) {
                return [
                    'id' => (string) $d->id,
                    'name' => [
                        'ar' => $d->name_ar ?? $d->name,
                        'en' => $d->name_en ?? $d->name_ar ?? $d->name,
                    ],
                    'name_ar' => $d->name_ar ?? $d->name,
                    'name_en' => $d->name_en ?? $d->name,
                    'description' => [
                        'ar' => $d->description_ar ?? $d->description ?? '',
                        'en' => $d->description_en ?? $d->description ?? '',
                    ],
                    'description_en' => $d->description_en ?? $d->description ?? '',
                    'icon' => $d->icon ?? 'Building2',
                    'featured' => true,
                    'subDirectorates' => $d->subDirectorates->map(function ($sub) {
                        return [
                            'id' => $sub->id,
                            'name' => [
                                'ar' => $sub->name_ar,
                                'en' => $sub->name_en ?? $sub->name_ar,
                            ],
                            'name_ar' => $sub->name_ar,
                            'name_en' => $sub->name_en ?? $sub->name_ar,
                            'url' => $sub->url,
                            'isExternal' => $sub->is_external,
                        ];
                    }),
                ];
            });
        });

        return response()->json($directorates);
    }

    /**
     * Get sub-directorates for a specific directorate
     */
    public function directorateSubDirectorates(string $id): JsonResponse
    {
        $directorate = Directorate::with(['subDirectorates' => function ($query) {
            $query->active()->ordered();
        }])->find($id);

        if (!$directorate) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $subDirectorates = $directorate->subDirectorates->map(function ($sub) {
            return [
                'id' => $sub->id,
                'name' => [
                    'ar' => $sub->name_ar,
                    'en' => $sub->name_en ?? $sub->name_ar,
                ],
                'name_ar' => $sub->name_ar,
                'name_en' => $sub->name_en,
                'url' => $sub->url,
                'isExternal' => $sub->is_external,
            ];
        });

        return response()->json($subDirectorates);
    }

    /**
     * Get services by directorate
     */
    public function directorateServices(string $id): JsonResponse
    {
        $services = Service::where('directorate_id', $id)
            ->active()
            ->ordered()
            ->get()
            ->map(fn($s) => $this->formatServiceModel($s));

        return response()->json($services);
    }

    /**
     * Get news by directorate (FR-11)
     * Returns latest news items for a specific directorate
     */
    public function directorateNews(string $id): JsonResponse
    {
        $limit = request()->integer('limit', 10);

        $news = Content::where('category', 'news')
            ->where('status', 'published')
            ->where('directorate_id', $id)
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn($n) => $this->formatNews($n));

        return response()->json($news);
    }

    /**
     * Get announcements for a specific directorate
     */
    public function directorateAnnouncements(string $id): JsonResponse
    {
        $limit = request()->integer('limit', 10);

        $announcements = Content::where('category', 'announcement')
            ->where('status', 'published')
            ->where('directorate_id', $id)
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn($a) => $this->formatAnnouncement($a));

        return response()->json($announcements);
    }

    /**
     * Get news grouped by directorate (FR-13)
     */
    public function newsByDirectorate(): JsonResponse
    {
        $directorates = Directorate::where('is_active', true)->get();
        $result = [];

        foreach ($directorates as $directorate) {
            $news = Content::where('category', 'news')
                ->where('status', 'published')
                ->where('directorate_id', $directorate->id)
                ->orderBy('published_at', 'desc')
                ->limit(3)
                ->get()
                ->map(fn($n) => $this->formatNews($n))
                ->values();

            if ($news->isNotEmpty()) {
                $result[] = [
                    'directorate' => [
                        'id' => (string) $directorate->id,
                        'name' => $directorate->name_ar,
                        'name_ar' => $directorate->name_ar,
                        'name_en' => $directorate->name_en,
                        'icon' => $directorate->icon ?? 'Building2',
                    ],
                    'news' => $news,
                ];
            }
        }

        return response()->json($result);
    }

    /**
     * Get all news (supports filtering by directorate)
     */
    public function news(Request $request): JsonResponse
    {
        $query = Content::where('category', 'news')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc');

        if ($request->has('directorate_id')) {
            $query->where('directorate_id', $request->directorate_id);
        }

        // Support server-side pagination
        if ($request->has('page')) {
            $perPage = $request->integer('per_page', 12);
            $paginated = $query->paginate($perPage);
            return response()->json([
                'data' => collect($paginated->items())->map(fn($n) => $this->formatNews($n)),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]);
        }

        // Legacy: return all (for backward compatibility with homepage etc.)
        if ($request->has('limit')) {
            $query->limit((int) $request->limit);
        }

        $news = $query->get()->map(fn($n) => $this->formatNews($n));

        return response()->json($news);
    }

    /**
     * Get breaking news (titles only)
     */
    public function breakingNews(): JsonResponse
    {
        return response()->json(Cache::remember('public.breaking_news', 60, function () {
            // Get news with active ticker (duration not expired)
            $tickerNews = Content::where('category', 'news')
                ->where('status', 'published')
                ->whereJsonContains('metadata->ticker_enabled', true)
                ->orderBy('published_at', 'desc')
                ->get(['title_ar', 'title_en', 'metadata']);

            // Filter by duration expiry
            $activeTickerNews = $tickerNews->filter(function ($item) {
                $meta = $item->metadata ?? [];
                $startsAt = $meta['ticker_starts_at'] ?? null;
                $durationHours = $meta['ticker_duration'] ?? 24;
                if (!$startsAt) return false;
                $expiresAt = \Carbon\Carbon::parse($startsAt)->addHours($durationHours);
                return now()->lt($expiresAt);
            });

            // If no active ticker news, fall back to latest news
            if ($activeTickerNews->isEmpty()) {
                $activeTickerNews = Content::where('category', 'news')
                    ->where('status', 'published')
                    ->orderBy('published_at', 'desc')
                    ->limit(5)
                    ->get(['title_ar', 'title_en']);
            }

            return $activeTickerNews->map(fn($n) => [
                'title_ar' => $n->title_ar,
                'title_en' => $n->title_en,
            ])->values()->toArray();
        }));
    }

    /**
     * Get hero article (featured news)
     */
    public function heroArticle(): JsonResponse
    {
        $article = Content::where('category', 'news')
            ->where('status', 'published')
            ->where('featured', true)
            ->orderBy('published_at', 'desc')
            ->first();

        if (!$article) {
            $article = Content::where('category', 'news')
                ->where('status', 'published')
                ->orderBy('published_at', 'desc')
                ->first();
        }

        if (!$article) {
            return response()->json([
                'id' => null,
                'title' => 'مرحباً بكم في البوابة الإلكترونية',
                'title_ar' => 'مرحباً بكم في البوابة الإلكترونية',
                'title_en' => 'Welcome to the E-Portal',
                'excerpt' => 'البوابة الرسمية لوزارة الاقتصاد والتجارة',
                'excerpt_ar' => 'البوابة الرسمية لوزارة الاقتصاد والتجارة',
                'excerpt_en' => 'Official portal of the Ministry of Economy and Trade',
                'category' => 'أخبار',
                'category_en' => 'News',
                'date' => now()->format('Y-m-d'),
                'author' => 'الوزارة',
                'author_en' => 'Ministry',
                'readTime' => '3 دقائق',
                'readTime_en' => '3 minutes',
                'imageUrl' => '/assets/hero-bg.jpg',
            ]);
        }

        return response()->json([
            'id' => (string) $article->id,
            'title' => $article->title_ar,
            'title_ar' => $article->title_ar,
            'title_en' => $article->title_en,
            'excerpt' => $article->seo_description_ar ?? mb_substr(strip_tags($article->content_ar), 0, 200),
            'excerpt_ar' => $article->seo_description_ar ?? mb_substr(strip_tags($article->content_ar), 0, 200),
            'excerpt_en' => $article->seo_description_en ?? mb_substr(strip_tags($article->content_en ?? ''), 0, 200),
            'category' => 'أخبار',
            'category_en' => 'News',
            'date' => $article->published_at?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'author' => $article->author?->name ?? 'الوزارة',
            'author_en' => $article->author?->name ?? 'Ministry',
            'readTime' => ceil(str_word_count(strip_tags($article->content_ar ?? '')) / 200) . ' دقائق',
            'readTime_en' => ceil(str_word_count(strip_tags($article->content_en ?? '')) / 200) . ' minutes',
            'imageUrl' => $this->normalizeImageUrl($article->metadata['image'] ?? null) ?? '/assets/hero-bg.jpg',
        ]);
    }

    /**
     * Get grid articles
     */
    public function gridArticles(): JsonResponse
    {
        $articles = Content::where('category', 'news')
            ->where('status', 'published')
            ->where('featured', false)
            ->orderBy('published_at', 'desc')
            ->limit(4)
            ->get()
            ->map(fn($a) => [
                'id' => (string) $a->id,
                'title' => $a->title_ar,
                'title_ar' => $a->title_ar,
                'title_en' => $a->title_en,
                'excerpt' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 150),
                'excerpt_ar' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 150),
                'excerpt_en' => $a->seo_description_en ?? mb_substr(strip_tags($a->content_en ?? ''), 0, 150),
                'category' => 'أخبار',
                'category_en' => 'News',
                'date' => $a->published_at?->format('Y-m-d') ?? now()->format('Y-m-d'),
                'author' => $a->author?->name ?? 'الوزارة',
                'author_en' => $a->author?->name ?? 'Ministry',
                'readTime' => '3 دقائق',
                'readTime_en' => '3 minutes',
                'imageUrl' => $this->normalizeImageUrl($a->metadata['image'] ?? null) ?? '/assets/news-placeholder.jpg',
            ]);

        return response()->json($articles);
    }

    /**
     * Get single news item
     */
    public function newsItem(string $id): JsonResponse
    {
        $news = Content::where('category', 'news')
            ->where('status', 'published')
            ->find($id);

        if (!$news) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $news->incrementViewCount();

        return response()->json($this->formatNews($news));
    }

    /**
     * Get all announcements (FR-58: Default 9 for 3x3 grid)
     */
    public function announcements(Request $request): JsonResponse
    {
        $query = Content::where('category', 'announcement')
            ->where('status', 'published')
            ->orderBy('priority', 'desc')
            ->orderBy('published_at', 'desc');

        // Filter by active/expired status
        if ($request->has('filter')) {
            match ($request->filter) {
                'active' => $query->active(),
                'expired' => $query->expired(),
                default => null,
            };
        }

        // Search by title or content (Arabic and English)
        if ($request->filled('search')) {
            $search = str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $request->search);
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%")
                  ->orWhere('content_ar', 'like', "%{$search}%")
                  ->orWhere('content_en', 'like', "%{$search}%");
            });
        }

        $formatAnnouncement = fn($a) => [
            'id' => (string) $a->id,
            'title' => $a->title_ar,
            'title_ar' => $a->title_ar,
            'title_en' => $a->title_en,
            'date' => $a->published_at?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'expires_at' => $a->expires_at?->format('Y-m-d'),
            'is_expired' => $a->isExpired(),
            'type' => $a->priority >= 9 ? 'urgent' : ($a->priority >= 5 ? 'important' : 'general'),
            'description' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 100),
            'description_ar' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 100),
            'description_en' => $a->seo_description_en ?? mb_substr(strip_tags($a->content_en ?? ''), 0, 100),
        ];

        // Support server-side pagination
        if ($request->has('page')) {
            $perPage = $request->integer('per_page', 9);
            $paginated = $query->paginate($perPage);
            return response()->json([
                'data' => collect($paginated->items())->map($formatAnnouncement),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]);
        }

        // Legacy: return limited results (for backward compatibility with homepage)
        $limit = $request->has('limit') ? (int) $request->limit : 9;
        $query->limit($limit);

        $announcements = $query->get()->map($formatAnnouncement);

        return response()->json($announcements);
    }

    /**
     * Get single announcement
     */
    public function announcement(string $id): JsonResponse
    {
        $announcement = Content::where('category', 'announcement')
            ->where('status', 'published')
            ->find($id);

        if (!$announcement) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json([
            'id' => (string) $announcement->id,
            'title' => $announcement->title_ar,
            'title_ar' => $announcement->title_ar,
            'title_en' => $announcement->title_en,
            'content' => $announcement->content_ar,
            'content_ar' => $announcement->content_ar,
            'content_en' => $announcement->content_en,
            'date' => $announcement->published_at?->format('Y-m-d'),
            'type' => $announcement->priority >= 9 ? 'urgent' : ($announcement->priority >= 5 ? 'important' : 'general'),
        ]);
    }

    /**
     * Get all decrees
     */
    public function decrees(Request $request): JsonResponse
    {
        $query = Content::where('category', 'decree')
            ->where('status', 'published')
            ->with(['directorate', 'attachments' => function ($q) {
                $q->where('is_public', true)->orderBy('display_order');
            }])
            ->orderBy('published_at', 'desc');

        if ($request->has('type') && $request->type !== 'all') {
            $query->whereJsonContains('metadata->decree_type', $request->type);
        }

        // M7.13: Filter by directorate
        if ($request->has('directorate_id') && $request->directorate_id) {
            $query->where('directorate_id', $request->directorate_id);
        }

        if ($request->has('q')) {
            $q = $request->q;
            $query->where(function ($query) use ($q) {
                $query->where('title_ar', 'like', "%{$q}%")
                    ->orWhere('title_en', 'like', "%{$q}%")
                    ->orWhere('content_ar', 'like', "%{$q}%")
                    ->orWhere('content_en', 'like', "%{$q}%");
            });
        }

        $typeEnMap = [
            'مرسوم تشريعي' => 'Legislative Decree',
            'قانون' => 'Law',
            'قرار رئاسي' => 'Presidential Decree',
            'تعميم' => 'Circular',
            'decree' => 'Decree',
        ];

        $decrees = $query->get()->map(fn($d) => [
            'id' => (string) $d->id,
            'number' => $d->metadata['number'] ?? $d->id,
            'year' => $d->metadata['year'] ?? $d->published_at?->format('Y'),
            'title' => $d->title_ar,
            'title_ar' => $d->title_ar,
            'title_en' => $d->title_en,
            'type' => $d->metadata['decree_type'] ?? 'decree',
            'type_en' => $typeEnMap[$d->metadata['decree_type'] ?? 'decree'] ?? 'Decree',
            'date' => $d->decree_date ?: $d->published_at?->format('Y-m-d'),
            'description' => $d->seo_description_ar ?? mb_substr(strip_tags($d->content_ar), 0, 200),
            'description_ar' => $d->seo_description_ar ?? mb_substr(strip_tags($d->content_ar), 0, 200),
            'description_en' => $d->seo_description_en ?? mb_substr(strip_tags($d->content_en ?? ''), 0, 200),
            'content_ar' => $d->content_ar,
            'content_en' => $d->content_en,
            'directorate_id' => $d->directorate_id,
            'directorate_name' => $d->directorate?->name_ar,
            'directorate_name_en' => $d->directorate?->name_en,
            'attachments' => $d->attachments->map(fn($a) => [
                'id' => $a->id,
                'file_name' => $a->file_name,
                'file_path' => $a->file_path,
                'file_type' => $a->file_type,
                'mime_type' => $a->mime_type,
                'file_size' => $a->file_size,
                'download_url' => url("/api/v1/public/decrees/{$d->id}/attachments/{$a->id}/download"),
            ])->toArray(),
        ]);

        return response()->json($decrees);
    }

    /**
     * Get all services
     */
    public function services(Request $request): JsonResponse
    {
        $query = Service::active()->ordered();

        if ($request->has('directorate_id')) {
            $query->where('directorate_id', $request->directorate_id);
        }

        if ($request->has('is_digital')) {
            $query->where('is_digital', $request->is_digital === 'true');
        }

        if ($request->has('q')) {
            $q = $request->q;
            $query->where(function ($query) use ($q) {
                $query->where('name_ar', 'like', "%{$q}%")
                    ->orWhere('name_en', 'like', "%{$q}%")
                    ->orWhere('description_ar', 'like', "%{$q}%")
                    ->orWhere('description_en', 'like', "%{$q}%");
            });
        }

        // Support server-side pagination
        if ($request->has('page')) {
            $perPage = $request->integer('per_page', 12);
            $paginated = $query->paginate($perPage);
            return response()->json([
                'data' => collect($paginated->items())->map(fn($s) => $this->formatServiceModel($s)),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]);
        }

        $services = $query->get()->map(fn($s) => $this->formatServiceModel($s));

        return response()->json($services);
    }

    /**
     * Get single service
     */
    public function service(string $id): JsonResponse
    {
        $service = Service::active()->find($id);

        if (!$service) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json($this->formatServiceModel($service));
    }

    /**
     * Get media items
     */
    public function media(Request $request): JsonResponse
    {
        $query = Content::where('category', 'media')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc');

        if ($request->has('type') && $request->type !== 'all') {
            $query->whereJsonContains('metadata->media_type', $request->type);
        }

        // Month/Year date filtering
        if ($request->filled('month')) {
            $query->whereMonth('published_at', (int) $request->month + 1); // JS months are 0-indexed
        }
        if ($request->filled('year')) {
            $query->whereYear('published_at', (int) $request->year);
        }

        $formatMedia = function($m) {
            $mediaType = $m->metadata['media_type'] ?? 'photo';
            // For photo/infographic types, use actual attachment count if metadata count is not set
            $count = $m->metadata['count'] ?? null;
            if (in_array($mediaType, ['photo', 'infographic']) && !$count) {
                $attachmentCount = $m->attachments()
                    ->where('is_public', true)
                    ->where('file_type', 'image')
                    ->count();
                if ($attachmentCount > 0) {
                    $count = $attachmentCount;
                }
            }
            return [
                'id' => (string) $m->id,
                'title' => $m->title_ar,
                'title_ar' => $m->title_ar,
                'title_en' => $m->title_en,
                'description_ar' => $m->seo_description_ar ?? mb_substr(strip_tags($m->content_ar), 0, 200),
                'description_en' => $m->seo_description_en ?? mb_substr(strip_tags($m->content_en ?? ''), 0, 200),
                'type' => $mediaType,
                'url' => $m->metadata['url'] ?? null,
                'thumbnailUrl' => $m->metadata['thumbnail'] ?? '/assets/media-placeholder.jpg',
                'date' => $m->published_at?->format('Y-m-d'),
                'duration' => $m->metadata['duration'] ?? null,
                'count' => $count ? (int) $count : null,
            ];
        };

        // Support server-side pagination
        if ($request->has('page')) {
            $perPage = $request->integer('per_page', 12);
            $paginated = $query->paginate($perPage);
            return response()->json([
                'data' => collect($paginated->items())->map($formatMedia),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]);
        }

        $media = $query->get()->map($formatMedia);

        return response()->json($media);
    }

    /**
     * Get album photos by media content ID
     */
    public function albumPhotos(string $id): JsonResponse
    {
        $content = Content::where('category', 'media')
            ->where('status', 'published')
            ->where('id', $id)
            ->first();

        if (!$content) {
            return response()->json(['error' => 'Album not found'], 404);
        }

        $attachments = $content->attachments()
            ->where('is_public', true)
            ->where('file_type', 'image')
            ->get()
            ->map(fn($a) => [
                'id' => (string) $a->id,
                'url' => $a->getUrl(),
                'title' => $a->title_ar ?? $a->title_en ?? $a->file_name,
                'title_ar' => $a->title_ar,
                'title_en' => $a->title_en,
                'file_name' => $a->file_name,
            ]);

        return response()->json([
            'id' => (string) $content->id,
            'title' => $content->title_ar,
            'title_ar' => $content->title_ar,
            'title_en' => $content->title_en,
            'date' => $content->published_at?->format('Y-m-d'),
            'count' => $attachments->count(),
            'photos' => $attachments,
        ]);
    }

    /**
     * Get FAQs
     */
    public function faqs(): JsonResponse
    {
        $directorateId = request()->query('directorate_id');
        $cacheKey = $directorateId ? "public.faqs.dir.{$directorateId}" : 'public.faqs';

        $faqs = Cache::remember($cacheKey, 600, function () use ($directorateId) {
            $query = Faq::where('is_active', true)
                ->where('is_published', true);

            if ($directorateId) {
                $query->where(function ($q) use ($directorateId) {
                    $q->where('directorate_id', $directorateId)
                      ->orWhereNull('directorate_id');
                });
            }

            return $query->orderBy('order')
                ->get()
                ->map(fn($f) => [
                'id' => (string) $f->id,
                'question' => $f->question_ar,
                'question_ar' => $f->question_ar,
                'question_en' => $f->question_en,
                'answer' => $f->answer_ar,
                'answer_ar' => $f->answer_ar,
                'answer_en' => $f->answer_en,
                'category' => $f->category ?? 'general',
                'directorate_id' => $f->directorate_id,
            ]);
        });

        // If no FAQs in database, return defaults
        if ($faqs->isEmpty()) {
            $faqs = collect([
                [
                    'id' => '1',
                    'question' => 'كيف يمكنني إنشاء حساب جديد على بوابة المواطن؟',
                    'question_ar' => 'كيف يمكنني إنشاء حساب جديد على بوابة المواطن؟',
                    'question_en' => 'How can I create a new account on the Citizen Portal?',
                    'answer' => 'يمكنك إنشاء حساب جديد بالضغط على زر تسجيل الدخول في أعلى الصفحة واختيار إنشاء حساب.',
                    'answer_ar' => 'يمكنك إنشاء حساب جديد بالضغط على زر تسجيل الدخول في أعلى الصفحة واختيار إنشاء حساب.',
                    'answer_en' => 'You can create a new account by clicking the login button at the top of the page and selecting create account.',
                    'category' => 'general'
                ],
                [
                    'id' => '2',
                    'question' => 'هل يمكنني تقديم شكوى دون الكشف عن هويتي؟',
                    'question_ar' => 'هل يمكنني تقديم شكوى دون الكشف عن هويتي؟',
                    'question_en' => 'Can I submit a complaint anonymously?',
                    'answer' => 'نعم، النظام يتيح تقديم الشكاوى بشكل سري تام. لا يمكن لأي جهة معرفة هوية مقدم الشكوى المجهول، وسيتم معالجة شكواك بنفس الاهتمام والجدية ولن يطلع عليه أحد.',
                    'answer_ar' => 'نعم، النظام يتيح تقديم الشكاوى بشكل سري تام. لا يمكن لأي جهة معرفة هوية مقدم الشكوى المجهول، وسيتم معالجة شكواك بنفس الاهتمام والجدية ولن يطلع عليه أحد.',
                    'answer_en' => 'Yes, the system allows fully anonymous complaint submission. No entity can identify the anonymous complainant, your complaint will be processed with the same attention and seriousness, and no one will have access to your identity.',
                    'category' => 'complaints'
                ],
            ]);
        }

        return response()->json($faqs);
    }

    /**
     * Global search with semantic search support (FR-36)
     * M7.3: Search respects language parameter - returns content in matching language.
     * M7.4: Only returns published content with valid routes.
     * M7.5: Results are ordered by relevance (title match > description match > content match).
     */
    public function search(Request $request): JsonResponse
    {
        $q = $request->get('q', '');
        $lang = $request->get('lang', 'ar');
        $type = $request->get('type');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');
        $entity = $request->get('entity');
        $useSemanticSearch = $request->boolean('semantic', true);

        if (strlen($q) < 2) {
            return response()->json(['results' => [], 'total' => 0, 'search_type' => 'none']);
        }

        // M7.1: Auto-detect language from query if not explicitly provided
        if (!$request->has('lang')) {
            $lang = $this->detectSearchLanguage($q);
        }

        $results = collect([]);
        $searchType = 'text';

        // Sanitize the query for LIKE usage
        $safeQ = str_replace(['%', '_'], ['\\%', '\\_'], $q);

        // Try semantic search first if enabled and available
        if ($useSemanticSearch && $this->vectorSearch->isAvailable()) {
            $semanticResults = $this->vectorSearch->semanticSearch($q, 30);

            if ($semanticResults->isNotEmpty()) {
                $searchType = 'semantic';
                // M7.3: Return both language fields for frontend to choose
                $results = $semanticResults->map(fn($r) => [
                    'id' => (string) $r->id,
                    'title' => $lang === 'ar' ? ($r->title_ar ?: $r->title_en) : ($r->title_en ?: $r->title_ar),
                    'title_ar' => $r->title_ar,
                    'title_en' => $r->title_en,
                    'description' => mb_substr(strip_tags($lang === 'ar' ? ($r->content_ar ?: $r->content_en) : ($r->content_en ?: $r->content_ar)), 0, 200),
                    'description_ar' => mb_substr(strip_tags($r->content_ar ?? ''), 0, 200),
                    'description_en' => mb_substr(strip_tags($r->content_en ?? ''), 0, 200),
                    'type' => $r->category,
                    'url' => $this->getContentUrl((object) ['id' => $r->id, 'category' => $r->category]),
                    'date' => $r->published_at ?? null,
                    'similarity' => round($r->similarity, 3),
                ]);
            }
        }

        // Fallback to text search if semantic search is disabled or returns no results
        if ($results->isEmpty()) {
            $searchType = 'text';

            // M7.4: Only search published content
            $query = Content::published();

            // M7.4: Filter by valid content categories only
            $validCategories = ['news', 'announcement', 'decree', 'service', 'faq'];
            if ($type && in_array($type, array_merge($validCategories, ['decrees', 'announcements', 'services']))) {
                // Map plural frontend types to singular backend categories
                $categoryMap = [
                    'news' => 'news',
                    'decrees' => 'decree',
                    'decree' => 'decree',
                    'announcements' => 'announcement',
                    'announcement' => 'announcement',
                    'services' => 'service',
                    'service' => 'service',
                    'faq' => 'faq',
                ];
                $query->where('category', $categoryMap[$type] ?? $type);
            } else {
                $query->whereIn('category', $validCategories);
            }

            // Search across all language fields
            $query->where(function ($qb) use ($safeQ) {
                $qb->where('title_ar', 'like', "%{$safeQ}%")
                    ->orWhere('title_en', 'like', "%{$safeQ}%")
                    ->orWhere('content_ar', 'like', "%{$safeQ}%")
                    ->orWhere('content_en', 'like', "%{$safeQ}%")
                    ->orWhere('seo_description_ar', 'like', "%{$safeQ}%")
                    ->orWhere('seo_description_en', 'like', "%{$safeQ}%");
            });

            // Date filters
            if ($dateFrom) {
                $query->where('published_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->where('published_at', '<=', $dateTo . ' 23:59:59');
            }

            // Entity/directorate filter
            if ($entity) {
                $query->where('directorate_id', $entity);
            }

            // M7.5: Order by relevance - title matches first, then description, then content
            $escapedQ = str_replace("'", "''", $q);
            $titleField = $lang === 'ar' ? 'title_ar' : 'title_en';
            $otherTitleField = $lang === 'ar' ? 'title_en' : 'title_ar';
            $descField = $lang === 'ar' ? 'seo_description_ar' : 'seo_description_en';

            $query->orderByRaw("CASE
                WHEN LOWER({$titleField}) = LOWER('{$escapedQ}') THEN 1
                WHEN LOWER({$titleField}) LIKE LOWER('{$escapedQ}%') THEN 2
                WHEN LOWER({$titleField}) LIKE LOWER('%{$escapedQ}%') THEN 3
                WHEN LOWER({$otherTitleField}) LIKE LOWER('%{$escapedQ}%') THEN 4
                WHEN LOWER(COALESCE({$descField}, '')) LIKE LOWER('%{$escapedQ}%') THEN 5
                ELSE 6
            END ASC");

            $results = $query->limit(30)
                ->get()
                ->map(fn($r) => [
                    'id' => (string) $r->id,
                    // M7.3: Return title/description in the search language
                    'title' => $lang === 'ar' ? ($r->title_ar ?: $r->title_en) : ($r->title_en ?: $r->title_ar),
                    'title_ar' => $r->title_ar,
                    'title_en' => $r->title_en,
                    'description' => mb_substr(strip_tags(
                        $lang === 'ar'
                            ? ($r->seo_description_ar ?: $r->content_ar ?: $r->seo_description_en ?: $r->content_en)
                            : ($r->seo_description_en ?: $r->content_en ?: $r->seo_description_ar ?: $r->content_ar)
                    ), 0, 200),
                    'description_ar' => mb_substr(strip_tags($r->seo_description_ar ?: $r->content_ar ?? ''), 0, 200),
                    'description_en' => mb_substr(strip_tags($r->seo_description_en ?: $r->content_en ?? ''), 0, 200),
                    'type' => $r->category,
                    'url' => $this->getContentUrl($r),
                    'date' => $r->published_at ? $r->published_at->toISOString() : null,
                ]);
        }

        // Also search Services if not filtering by a specific content type (or filtering by services)
        $serviceResults = collect([]);
        if (!$type || $type === 'services' || $type === 'service') {
            $serviceQuery = Service::active()
                ->where(function ($qb) use ($safeQ) {
                    $qb->where('name_ar', 'like', "%{$safeQ}%")
                        ->orWhere('name_en', 'like', "%{$safeQ}%")
                        ->orWhere('description_ar', 'like', "%{$safeQ}%")
                        ->orWhere('description_en', 'like', "%{$safeQ}%");
                });

            $serviceResults = $serviceQuery->limit(10)->get()->map(fn($s) => [
                'id' => (string) $s->id,
                'title' => $lang === 'ar' ? ($s->name_ar ?: $s->name_en) : ($s->name_en ?: $s->name_ar),
                'title_ar' => $s->name_ar,
                'title_en' => $s->name_en,
                'description' => mb_substr(strip_tags(
                    $lang === 'ar'
                        ? ($s->description_ar ?: $s->description_en)
                        : ($s->description_en ?: $s->description_ar)
                ) ?? '', 0, 200),
                'type' => 'service',
                'url' => '/services/' . $s->id,
                'date' => $s->created_at ? $s->created_at->toISOString() : null,
                'isDigital' => $s->is_digital ?? false,
            ]);
        }

        // Also search FAQs if not filtering by a specific content type (or filtering by FAQ)
        $faqResults = collect([]);
        if (!$type || $type === 'faq') {
            $faqQuery = Faq::where('is_published', true)
                ->where('is_active', true)
                ->where(function ($qb) use ($safeQ) {
                    $qb->where('question_ar', 'like', "%{$safeQ}%")
                        ->orWhere('question_en', 'like', "%{$safeQ}%")
                        ->orWhere('answer_ar', 'like', "%{$safeQ}%")
                        ->orWhere('answer_en', 'like', "%{$safeQ}%");
                });

            $faqResults = $faqQuery->limit(5)->get()->map(fn($f) => [
                'id' => (string) $f->id,
                'title' => $lang === 'ar' ? ($f->question_ar ?: $f->question_en) : ($f->question_en ?: $f->question_ar),
                'title_ar' => $f->question_ar,
                'title_en' => $f->question_en,
                'description' => mb_substr(strip_tags(
                    $lang === 'ar' ? ($f->answer_ar ?: $f->answer_en) : ($f->answer_en ?: $f->answer_ar)
                ) ?? '', 0, 200),
                'question_ar' => $f->question_ar,
                'question_en' => $f->question_en,
                'answer_ar' => $f->answer_ar,
                'answer_en' => $f->answer_en,
                'type' => 'faq',
                'url' => '/faq',
                'date' => $f->created_at ? $f->created_at->toISOString() : null,
            ]);
        }

        // Merge all results
        $allResults = $results->merge($serviceResults)->merge($faqResults);

        return response()->json([
            'results' => $allResults->values(),
            'total' => $allResults->count(),
            'search_type' => $searchType,
        ]);
    }


    /**
     * AI-generated summary for content (FR-12)
     */
    public function summarize(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|min:10',
            'lang' => 'nullable|string|in:ar,en',
        ]);

        $content = $validated['content'];
        $lang = $validated['lang'] ?? 'ar';

        try {
            // Check cache first to avoid redundant AI calls
            $cacheKey = 'ai_summary_' . md5($content . '_' . $lang);
            $summary = Cache::remember($cacheKey, 3600 * 24, function () use ($content, $lang) {
                return $this->aiService->summarize($content, $lang);
            });

            if (!$summary) {
                return response()->json(['error' => 'Failed to generate summary'], 500);
            }

            return response()->json(['summary' => $summary]);
        } catch (\Exception $e) {
            Log::error('Public AI Summary error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during summarization'], 500);
        }
    }

    /**
     * FR-36: Dedicated semantic search endpoint with filters
     */
    public function semanticSearch(Request $request): JsonResponse
    {
        $query = $request->get('query', '');
        $limit = (int) $request->get('limit', 20);
        $minScore = (float) $request->get('min_score', 0.5);
        $category = $request->get('category');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        if (strlen($query) < 2) {
            return response()->json(['results' => [], 'total' => 0]);
        }

        if (!$this->vectorSearch->isAvailable()) {
            return response()->json([
                'error' => 'Semantic search is not available',
                'results' => [],
                'total' => 0,
            ], 503);
        }

        // Perform semantic search
        $results = $this->vectorSearch->semanticSearch($query, $limit);

        // Apply filters
        $filteredResults = $results->filter(function ($result) use ($minScore, $category, $dateFrom, $dateTo) {
            // Similarity score filter
            if ($result->similarity < $minScore) {
                return false;
            }

            // Category filter
            if ($category && $result->category !== $category) {
                return false;
            }

            // Date range filters
            if ($dateFrom && $result->published_at < $dateFrom) {
                return false;
            }

            if ($dateTo && $result->published_at > $dateTo) {
                return false;
            }

            return true;
        });

        // Format results
        $formattedResults = $filteredResults->map(function ($result) {
            return [
                'id' => $result->id,
                'title_ar' => $result->title_ar,
                'title_en' => $result->title_en,
                'content_ar' => mb_substr(strip_tags($result->content_ar), 0, 500),
                'content_en' => mb_substr(strip_tags($result->content_en), 0, 500),
                'category' => $result->category,
                'published_at' => $result->published_at,
                'similarity_score' => round($result->similarity, 3),
                'tags' => $result->tags ?? [],
            ];
        });

        return response()->json([
            'results' => $formattedResults->values(),
            'total' => $formattedResults->count(),
            'filters_applied' => [
                'min_score' => $minScore,
                'category' => $category,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Get complaint templates (public endpoint for complaint form)
     */
    public function getComplaintTemplates(Request $request): JsonResponse
    {
        $query = ComplaintTemplate::where('is_active', true);

        // If anonymous=true, filter out templates requiring identification
        if ($request->boolean('anonymous')) {
            $query->where(function ($q) {
                $q->where('requires_identification', false)
                  ->orWhereNull('requires_identification');
            });
        }

        $templates = $query->with('directorate')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn($t) => [
                'id' => (string) $t->id,
                'directorate_id' => $t->directorate_id,
                'name' => $t->name,
                'name_en' => $t->name_en,
                'description' => $t->description,
                'description_en' => $t->description_en,
                'type' => $t->type ?? 'standard',
                'requires_identification' => (bool) $t->requires_identification,
                'fields' => $t->fields,
                'sort_order' => $t->sort_order ?? 0,
                'receiving_entity_ar' => $t->directorate ? $t->directorate->name_ar : null,
                'receiving_entity_en' => $t->directorate ? $t->directorate->name_en : null,
            ]);

        return response()->json(['data' => $templates]);
    }

    // Helper methods
    private function normalizeImageUrl(?string $path): ?string
    {
        if (!$path) return null;
        // Already absolute URL or storage path
        if (str_starts_with($path, 'http')) return $path;
        if (str_starts_with($path, '/storage/')) return $path;
        // Static assets (public directory) - do not prefix with /storage/
        if (str_starts_with($path, '/assets/') || str_starts_with($path, '/images/')) return $path;
        return '/storage/' . ltrim($path, '/');
    }

    private function formatNews($n): array
    {
        $images = $n->metadata['images'] ?? [];
        $normalizedImages = array_map(fn($img) => $this->normalizeImageUrl($img), $images);

        return [
            'id' => (string) $n->id,
            'title' => $n->title_ar,
            'title_ar' => $n->title_ar,
            'title_en' => $n->title_en,
            'date' => $n->published_at?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'category' => 'أخبار',
            'category_en' => 'News',
            'summary' => $n->seo_description_ar ?? mb_substr(strip_tags($n->content_ar), 0, 200),
            'summary_ar' => $n->seo_description_ar ?? mb_substr(strip_tags($n->content_ar), 0, 200),
            'summary_en' => $n->seo_description_en ?? mb_substr(strip_tags($n->content_en ?? ''), 0, 200),
            'content_ar' => $n->content_ar,
            'content_en' => $n->content_en,
            'imageUrl' => $this->normalizeImageUrl($n->metadata['image'] ?? null),
            'images' => $normalizedImages,
            'author' => $n->metadata['author'] ?? null,
            'read_time' => $n->metadata['read_time'] ?? null,
            'category_label' => $n->metadata['category_label'] ?? null,
            'isUrgent' => $n->priority >= 8,
            'directorate_id' => $n->directorate_id,
            'directorate_name' => $n->directorate?->name_ar,
            'directorate_name_en' => $n->directorate?->name_en,
        ];
    }

    private function formatAnnouncement($a): array
    {
        return [
            'id' => (string) $a->id,
            'title' => $a->title_ar,
            'title_ar' => $a->title_ar,
            'title_en' => $a->title_en,
            'date' => $a->published_at?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'category' => $a->metadata['category_label'] ?? 'إعلان',
            'category_en' => $a->metadata['category_label_en'] ?? 'Announcement',
            'description' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 100),
            'description_ar' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 100),
            'description_en' => $a->seo_description_en ?? mb_substr(strip_tags($a->content_en ?? ''), 0, 100),
            'summary' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 100),
            'summary_ar' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 100),
            'summary_en' => $a->seo_description_en ?? mb_substr(strip_tags($a->content_en ?? ''), 0, 100),
            'imageUrl' => $this->normalizeImageUrl($a->metadata['image'] ?? null),
            'isUrgent' => $a->priority >= 8,
            'directorate_id' => $a->directorate_id,
            'directorate_name' => $a->directorate?->name_ar,
            'directorate_name_en' => $a->directorate?->name_en,
        ];
    }

    private function formatServiceModel(Service $s): array
    {
        // Normalize requirements: always return an array
        $requirements = $s->requirements;
        if (is_string($requirements)) {
            // Try JSON decode first (in case it's a JSON string)
            $decoded = json_decode($requirements, true);
            if (is_array($decoded)) {
                $requirements = $decoded;
            } else {
                // Split plain text by newlines
                $requirements = array_values(array_filter(
                    array_map('trim', preg_split('/\r?\n/', $requirements)),
                    fn($r) => strlen($r) > 0
                ));
            }
        } elseif (!is_array($requirements)) {
            $requirements = [];
        }

        return [
            'id' => (string) $s->id,
            'title' => $s->name_ar,
            'title_ar' => $s->name_ar,
            'title_en' => $s->name_en,
            'directorateId' => (string) $s->directorate_id,
            'isDigital' => $s->is_digital,
            'description' => $s->description_ar ? mb_substr(strip_tags($s->description_ar), 0, 200) : '',
            'description_ar' => $s->description_ar ? mb_substr(strip_tags($s->description_ar), 0, 200) : '',
            'description_en' => $s->description_en ? mb_substr(strip_tags($s->description_en), 0, 200) : '',
            'content_ar' => $s->description_ar,
            'content_en' => $s->description_en,
            'icon' => $s->icon,
            'category' => $s->category,
            'url' => $s->url,
            'fees' => $s->fees,
            'estimated_time' => $s->estimated_time,
            'requirements' => $requirements,
        ];
    }

    private function formatService($s): array
    {
        return [
            'id' => (string) $s->id,
            'title' => $s->title_ar,
            'title_ar' => $s->title_ar,
            'title_en' => $s->title_en,
            'directorateId' => (string) ($s->metadata['directorate_id'] ?? ''),
            'isDigital' => $s->metadata['is_digital'] ?? false,
            'description' => $s->seo_description_ar ?? mb_substr(strip_tags($s->content_ar), 0, 200),
            'description_ar' => $s->seo_description_ar ?? mb_substr(strip_tags($s->content_ar), 0, 200),
            'description_en' => $s->seo_description_en ?? mb_substr(strip_tags($s->content_en ?? ''), 0, 200),
            'content_ar' => $s->content_ar,
            'content_en' => $s->content_en,
        ];
    }

    /**
     * M7.1: Detect search query language based on character analysis.
     */
    private function detectSearchLanguage(string $text): string
    {
        $arabicCount = preg_match_all('/[\x{0600}-\x{06FF}\x{0750}-\x{077F}\x{08A0}-\x{08FF}\x{FB50}-\x{FDFF}\x{FE70}-\x{FEFF}]/u', $text);
        $latinCount = preg_match_all('/[a-zA-Z]/', $text);
        return $arabicCount > $latinCount ? 'ar' : 'en';
    }

    private function getContentUrl($content): string
    {
        return match($content->category) {
            'news' => "/news/{$content->id}",
            'announcement' => "/announcements/{$content->id}",
            'decree' => "/decrees/{$content->id}",
            'service' => "/services/{$content->id}",
            default => "/{$content->category}/{$content->id}",
        };
    }

    /**
     * Get open data datasets
     */
    public function openData(): JsonResponse
    {
        $datasets = Content::where('category', 'open_data')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(fn($d) => [
                'id' => (string) $d->id,
                'title_ar' => $d->title_ar,
                'title_en' => $d->title_en,
                'description_ar' => $d->seo_description_ar ?? $d->content_ar,
                'description_en' => $d->content_en,
                'date' => $d->decree_date ?: $d->published_at?->format('Y-m-d'),
                'format' => $d->metadata['format'] ?? 'PDF',
                'size' => $d->metadata['size'] ?? '',
                'category_label' => $d->metadata['category_label'] ?? '',
                'download_url' => $d->metadata['download_url'] ?? null,
            ]);

        return response()->json($datasets);
    }

    /**
     * Submit contact form
     */
    public function submitContactForm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'department' => 'required|string|max:255',
        ]);

        // Determine recipient email based on department/directorate selection
        $recipientEmail = null;
        $recipientName = null;
        $directorate = null;

        if (!empty($validated['department'])) {
            // Check if it's a directorate
            $directorate = \App\Models\Directorate::find($validated['department']);
            if ($directorate && $directorate->email) {
                $recipientEmail = $directorate->email;
                $recipientName = $directorate->name_ar ?? $directorate->name;
            } else {
                // Handle department-specific emails
                $departmentEmails = [
                    'general' => config('mail.contact_general', 'info@moe.gov.sy'),
                    'complaints' => config('mail.contact_complaints', 'complaints@moe.gov.sy'),
                    'media' => config('mail.contact_media', 'media@moe.gov.sy'),
                ];
                $recipientEmail = $departmentEmails[$validated['department']] ?? config('mail.contact_default', 'info@moe.gov.sy');
                $recipientName = $this->getDepartmentName($validated['department']);
            }
        }

        // Default to general contact email if no specific recipient found
        if (!$recipientEmail) {
            $recipientEmail = config('mail.contact_default', 'info@moe.gov.sy');
            $recipientName = 'وزارة الاقتصاد والصناعة';
        }

        // Save contact form submission to database
        \App\Models\ContactSubmission::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'department' => $validated['department'] ?? 'general',
            'recipient_email' => $recipientEmail,
            'recipient_name' => $recipientName,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        Log::info('Contact form submitted', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'recipient' => $recipientEmail,
            'recipient_name' => $recipientName,
            'department' => $validated['department'] ?? 'general',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال رسالتك بنجاح إلى ' . $recipientName . '. سنتواصل معك في أقرب وقت.',
            'message_en' => 'Your message has been sent successfully to ' . ($directorate ? ($directorate->name_en ?? $recipientName) : $recipientName) . '. We will contact you shortly.',
        ]);
    }

    /**
     * Get department name based on department key
     */
    private function getDepartmentName(string $department): string
    {
        $names = [
            'general' => 'الإدارة العامة',
            'complaints' => 'قسم الشكاوى',
            'media' => 'الإدارة الإعلامية',
        ];

        return $names[$department] ?? 'وزارة الاقتصاد والصناعة';
    }

    /**
     * Submit suggestion rating
     */
    public function submitSuggestionRating(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracking_number' => 'required|string|max:50',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'feedback_type' => 'nullable|in:positive,negative',
        ]);

        // T6-FIX: Verify suggestion exists with retry for race condition
        // When users rate immediately after submission, the suggestion may not be
        // fully committed to DB yet. Retry up to 3 times with short delays.
        $suggestion = null;
        for ($attempt = 0; $attempt < 3; $attempt++) {
            $suggestion = \App\Models\Suggestion::where('tracking_number', $validated['tracking_number'])->first();
            if ($suggestion) {
                break;
            }
            if ($attempt < 2) {
                usleep(500000); // Wait 500ms before retry
            }
        }

        if (!$suggestion) {
            return response()->json([
                'success' => false,
                'message' => 'المقترح غير موجود. يرجى المحاولة مرة أخرى بعد لحظات.',
                'message_en' => 'Suggestion not found. Please try again in a moment.',
            ], 404);
        }

        // Check if rating already exists for this tracking number from same IP
        $existingRating = SuggestionRating::where('tracking_number', $validated['tracking_number'])
            ->where('ip_address', $request->ip())
            ->first();

        if ($existingRating) {
            // Update existing rating
            $existingRating->update([
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
                'feedback_type' => $validated['feedback_type'] ?? null,
            ]);

            Log::info('Suggestion rating updated', [
                'tracking_number' => $validated['tracking_number'],
                'rating' => $validated['rating'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث تقييمك بنجاح',
                'message_en' => 'Your rating has been updated successfully',
            ]);
        }

        // Create new rating
        SuggestionRating::create([
            'tracking_number' => $validated['tracking_number'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'feedback_type' => $validated['feedback_type'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        Log::info('Suggestion rating submitted', [
            'tracking_number' => $validated['tracking_number'],
            'rating' => $validated['rating'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'شكراً لتقييمك! نقدّر ملاحظاتك',
            'message_en' => 'Thank you for your rating! We appreciate your feedback',
        ]);
    }

    /**
     * Get suggestion ratings statistics
     */
    public function getSuggestionRatingsStats(Request $request): JsonResponse
    {
        $trackingNumber = $request->query('tracking_number');

        $query = SuggestionRating::query();

        if ($trackingNumber) {
            $query->where('tracking_number', $trackingNumber);
        }

        $stats = [
            'total_ratings' => $query->count(),
            'average_rating' => round($query->avg('rating'), 2),
            'rating_distribution' => [
                '5' => (clone $query)->where('rating', 5)->count(),
                '4' => (clone $query)->where('rating', 4)->count(),
                '3' => (clone $query)->where('rating', 3)->count(),
                '2' => (clone $query)->where('rating', 2)->count(),
                '1' => (clone $query)->where('rating', 1)->count(),
            ],
            'helpful_count' => [
                'positive' => (clone $query)->where('feedback_type', 'positive')->count(),
                'negative' => (clone $query)->where('feedback_type', 'negative')->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get quick links by section
     */
    public function quickLinks(Request $request): JsonResponse
    {
        $section = $request->query('section', 'homepage');
        $directorateId = $request->query('directorate_id');

        $cacheKey = "public.quick_links.{$section}" . ($directorateId ? ".dir.{$directorateId}" : '.global');

        $links = Cache::remember($cacheKey, 600, function () use ($section, $directorateId) {
            $query = QuickLink::active()
                ->section($section)
                ->ordered();

            if ($directorateId) {
                // Return directorate-specific links, falling back to generic section links
                $dirLinks = (clone $query)->forDirectorate($directorateId)->get();
                if ($dirLinks->isEmpty()) {
                    $dirLinks = (clone $query)->forDirectorate(null)->get();
                }
                return $dirLinks;
            } else {
                $query->forDirectorate(null);
            }

            return $query->get();
        })->map(fn ($link) => [
            'id' => $link->id,
            'label_ar' => $link->label_ar,
            'label_en' => $link->label_en,
            'url' => $link->url,
            'icon' => $link->icon,
            'section' => $link->section,
            'directorate_id' => $link->directorate_id,
        ]);

        return response()->json($links);
    }

    /**
     * Get a static page by slug (privacy-policy, terms, about)
     */
    public function staticPage(string $slug): JsonResponse
    {
        $allowedSlugs = ['privacy-policy', 'terms', 'about'];

        if (!in_array($slug, $allowedSlugs)) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        $page = Cache::remember("public.page.{$slug}", 600, function () use ($slug) {
            return Content::where('slug', $slug)
                ->where('category', 'page')
                ->where('status', Content::STATUS_PUBLISHED)
                ->first();
        });

        if (!$page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        return response()->json([
            'id' => (string) $page->id,
            'slug' => $page->slug,
            'title_ar' => $page->title_ar,
            'title_en' => $page->title_en,
            'content_ar' => $page->content_ar,
            'content_en' => $page->content_en,
            'updated_at' => $page->updated_at?->format('Y-m-d'),
        ]);
    }

    /**
     * Submit happiness feedback (مؤشر الرضا)
     * POST /api/v1/public/happiness-feedback
     */
    public function submitHappinessFeedback(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:3',
            'page' => 'nullable|string|max:255',
        ]);

        // Rate limit: 1 submission per session/IP per hour
        $sessionId = $request->header('X-Session-Id', $request->ip());
        $recentExists = HappinessFeedback::where('session_id', $sessionId)
            ->where('created_at', '>=', now()->subHour())
            ->exists();

        if ($recentExists) {
            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل تقييمك سابقاً',
                'message_en' => 'Your feedback was already recorded',
            ]);
        }

        HappinessFeedback::create([
            'rating' => $validated['rating'],
            'page' => $validated['page'] ?? null,
            'session_id' => $sessionId,
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'شكراً لتقييمك!',
            'message_en' => 'Thank you for your feedback!',
        ]);
    }

    /**
     * Get happiness feedback analytics (for admin dashboard)
     * GET /api/v1/public/happiness-feedback/stats
     */
    public function getHappinessFeedbackStats(): JsonResponse
    {
        $stats = Cache::remember('happiness_feedback_stats', 300, function () {
            $total = HappinessFeedback::count();
            if ($total === 0) {
                return [
                    'total' => 0,
                    'average' => 0,
                    'satisfaction_rate' => 0,
                    'distribution' => ['happy' => 0, 'neutral' => 0, 'sad' => 0],
                ];
            }

            $distribution = [
                'happy' => HappinessFeedback::where('rating', 3)->count(),
                'neutral' => HappinessFeedback::where('rating', 2)->count(),
                'sad' => HappinessFeedback::where('rating', 1)->count(),
            ];

            $average = HappinessFeedback::avg('rating');
            $satisfactionRate = round(($distribution['happy'] / $total) * 100, 1);

            return [
                'total' => $total,
                'average' => round($average, 2),
                'satisfaction_rate' => $satisfactionRate,
                'distribution' => $distribution,
            ];
        });

        return response()->json($stats);
    }
}
