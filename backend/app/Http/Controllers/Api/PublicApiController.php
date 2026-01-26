<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Directorate;
use App\Models\Faq;
use App\Services\VectorSearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicApiController extends Controller
{
    protected VectorSearchService $vectorSearch;

    public function __construct(VectorSearchService $vectorSearch)
    {
        $this->vectorSearch = $vectorSearch;
    }
    /**
     * Get all directorates
     */
    public function directorates(): JsonResponse
    {
        $directorates = Directorate::all()->map(function ($d) {
            return [
                'id' => (string) $d->id,
                'name' => $d->name_ar ?? $d->name,
                'name_ar' => $d->name_ar ?? $d->name,
                'name_en' => $d->name_en ?? $d->name,
                'description' => $d->description_ar ?? $d->description ?? '',
                'icon' => $d->icon ?? 'Building2',
                'servicesCount' => Content::where('category', 'service')
                    ->where('status', 'published')
                    ->whereJsonContains('metadata->directorate_id', $d->id)
                    ->count(),
            ];
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

        return response()->json([
            'id' => (string) $directorate->id,
            'name' => $directorate->name_ar ?? $directorate->name,
            'name_ar' => $directorate->name_ar ?? $directorate->name,
            'name_en' => $directorate->name_en ?? $directorate->name,
            'description' => $directorate->description_ar ?? $directorate->description ?? '',
            'icon' => $directorate->icon ?? 'Building2',
        ]);
    }

    /**
     * Get featured directorates (FR-49 to FR-51)
     * Returns 3 featured directorates with their sub-directorates
     */
    public function featuredDirectorates(): JsonResponse
    {
        $directorates = Directorate::featured()
            ->with(['subDirectorates' => function ($query) {
                $query->active()->ordered();
            }])
            ->get()
            ->map(function ($d) {
                return [
                    'id' => (string) $d->id,
                    'name' => $d->name_ar ?? $d->name,
                    'name_ar' => $d->name_ar ?? $d->name,
                    'name_en' => $d->name_en ?? $d->name,
                    'description' => $d->description_ar ?? $d->description ?? '',
                    'icon' => $d->icon ?? 'Building2',
                    'featured' => true,
                    'subDirectorates' => $d->subDirectorates->map(function ($sub) {
                        return [
                            'id' => $sub->id,
                            'name' => $sub->name_ar,
                            'name_ar' => $sub->name_ar,
                            'name_en' => $sub->name_en,
                            'url' => $sub->url,
                            'isExternal' => $sub->is_external,
                        ];
                    }),
                ];
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
                'name' => $sub->name_ar,
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
        $services = Content::where('category', 'service')
            ->where('status', 'published')
            ->whereJsonContains('metadata->directorate_id', (int) $id)
            ->get()
            ->map(fn($s) => $this->formatService($s));

        return response()->json($services);
    }

    /**
     * Get news by directorate (FR-11)
     * Returns 3 latest news items per directorate
     */
    public function directorateNews(string $id): JsonResponse
    {
        $news = Content::where('category', 'news')
            ->where('status', 'published')
            ->whereJsonContains('metadata->directorate_id', (int) $id)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get()
            ->map(fn($n) => $this->formatNews($n));

        return response()->json($news);
    }

    /**
     * Get news grouped by directorate (FR-13)
     */
    public function newsByDirectorate(): JsonResponse
    {
        $directorates = Directorate::all();
        $result = [];

        foreach ($directorates as $directorate) {
             $news = Content::where('category', 'news')
                ->where('status', 'published')
                ->whereJsonContains('metadata->directorate_id', $directorate->id)
                ->orderBy('published_at', 'desc')
                ->limit(3)
                ->get()
                ->map(fn($n) => $this->formatNews($n));

             if ($news->isNotEmpty()) {
                 $result[] = [
                     'directorate' => [
                         'id' => (string) $directorate->id,
                         'name' => $directorate->name_ar ?? $directorate->name,
                         'name_ar' => $directorate->name_ar ?? $directorate->name,
                         'name_en' => $directorate->name_en ?? $directorate->name,
                         'icon' => $directorate->icon ?? 'Building2',
                     ],
                     'news' => $news
                 ];
             }
        }

        return response()->json($result);
    }

    /**
     * Get all news
     */
    public function news(Request $request): JsonResponse
    {
        $query = Content::where('category', 'news')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc');

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
        $newsQuery = Content::where('category', 'news')
            ->where('status', 'published')
            ->where('priority', '>=', 8)
            ->orderBy('published_at', 'desc')
            ->limit(5);

        $newsItems = $newsQuery->get(['title_ar', 'title_en']);

        // If no breaking news, get latest news titles
        if ($newsItems->isEmpty()) {
            $newsItems = Content::where('category', 'news')
                ->where('status', 'published')
                ->orderBy('published_at', 'desc')
                ->limit(5)
                ->get(['title_ar', 'title_en']);
        }

        $news = $newsItems->map(fn($n) => [
            'title_ar' => $n->title_ar,
            'title_en' => $n->title_en,
        ])->toArray();

        return response()->json($news);
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
            'imageUrl' => $article->metadata['image'] ?? '/assets/hero-bg.jpg',
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
                'imageUrl' => $a->metadata['image'] ?? '/assets/news-placeholder.jpg',
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

        // Default limit of 9 for homepage 3x3 grid (T-MOD-034)
        $limit = $request->has('limit') ? (int) $request->limit : 9;
        $query->limit($limit);

        $announcements = $query->get()->map(fn($a) => [
            'id' => (string) $a->id,
            'title' => $a->title_ar,
            'title_ar' => $a->title_ar,
            'title_en' => $a->title_en,
            'date' => $a->published_at?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'type' => $a->priority >= 9 ? 'urgent' : ($a->priority >= 5 ? 'important' : 'general'),
            'description' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 200),
            'description_ar' => $a->seo_description_ar ?? mb_substr(strip_tags($a->content_ar), 0, 200),
            'description_en' => $a->seo_description_en ?? mb_substr(strip_tags($a->content_en ?? ''), 0, 200),
        ]);

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
            ->orderBy('published_at', 'desc');

        if ($request->has('type') && $request->type !== 'all') {
            $query->whereJsonContains('metadata->decree_type', $request->type);
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

        $decrees = $query->get()->map(fn($d) => [
            'id' => (string) $d->id,
            'number' => $d->metadata['number'] ?? $d->id,
            'year' => $d->metadata['year'] ?? $d->published_at?->format('Y'),
            'title' => $d->title_ar,
            'title_ar' => $d->title_ar,
            'title_en' => $d->title_en,
            'type' => $d->metadata['decree_type'] ?? 'decree',
            'date' => $d->published_at?->format('Y-m-d'),
            'description' => $d->seo_description_ar ?? mb_substr(strip_tags($d->content_ar), 0, 200),
            'description_ar' => $d->seo_description_ar ?? mb_substr(strip_tags($d->content_ar), 0, 200),
            'description_en' => $d->seo_description_en ?? mb_substr(strip_tags($d->content_en ?? ''), 0, 200),
            'content_ar' => $d->content_ar,
            'content_en' => $d->content_en,
        ]);

        return response()->json($decrees);
    }

    /**
     * Get all services
     */
    public function services(Request $request): JsonResponse
    {
        $query = Content::where('category', 'service')
            ->where('status', 'published')
            ->orderBy('title_ar');

        if ($request->has('directorate_id')) {
            $query->whereJsonContains('metadata->directorate_id', (int) $request->directorate_id);
        }

        if ($request->has('is_digital')) {
            $query->whereJsonContains('metadata->is_digital', $request->is_digital === 'true');
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

        $services = $query->get()->map(fn($s) => $this->formatService($s));

        return response()->json($services);
    }

    /**
     * Get single service
     */
    public function service(string $id): JsonResponse
    {
        $service = Content::where('category', 'service')
            ->where('status', 'published')
            ->find($id);

        if (!$service) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json($this->formatService($service));
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

        $media = $query->get()->map(fn($m) => [
            'id' => (string) $m->id,
            'title' => $m->title_ar,
            'title_ar' => $m->title_ar,
            'title_en' => $m->title_en,
            'description_ar' => $m->seo_description_ar ?? mb_substr(strip_tags($m->content_ar), 0, 200),
            'description_en' => $m->seo_description_en ?? mb_substr(strip_tags($m->content_en ?? ''), 0, 200),
            'type' => $m->metadata['media_type'] ?? 'photo',
            'thumbnailUrl' => $m->metadata['thumbnail'] ?? '/assets/media-placeholder.jpg',
            'date' => $m->published_at?->format('Y-m-d'),
            'duration' => $m->metadata['duration'] ?? null,
            'count' => $m->metadata['count'] ?? null,
        ]);

        return response()->json($media);
    }

    /**
     * Get FAQs
     */
    public function faqs(): JsonResponse
    {
        $faqs = Faq::where('is_active', true)
            ->where('is_published', true)
            ->orderBy('order')
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
            ]);

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
                    'answer' => 'نعم، النظام يتيح تقديم الشكاوى بشكل سري.',
                    'answer_ar' => 'نعم، النظام يتيح تقديم الشكاوى بشكل سري.',
                    'answer_en' => 'Yes, the system allows submitting complaints confidentially.',
                    'category' => 'complaints'
                ],
                [
                    'id' => '3',
                    'question' => 'كم تستغرق معالجة طلبات الخدمات الإلكترونية؟',
                    'question_ar' => 'كم تستغرق معالجة طلبات الخدمات الإلكترونية؟',
                    'question_en' => 'How long does it take to process e-service requests?',
                    'answer' => 'تختلف المدة حسب نوع الخدمة، ولكن معظم الخدمات الإلكترونية الفورية تتم خلال دقائق.',
                    'answer_ar' => 'تختلف المدة حسب نوع الخدمة، ولكن معظم الخدمات الإلكترونية الفورية تتم خلال دقائق.',
                    'answer_en' => 'The duration varies depending on the service type, but most instant e-services are completed within minutes.',
                    'category' => 'services'
                ],
            ]);
        }

        return response()->json($faqs);
    }

    /**
     * Global search with semantic search support (FR-36)
     */
    public function search(Request $request): JsonResponse
    {
        $q = $request->get('q', '');
        $useSemanticSearch = $request->boolean('semantic', true);

        if (strlen($q) < 2) {
            return response()->json(['results' => [], 'total' => 0, 'search_type' => 'none']);
        }

        $results = collect([]);
        $searchType = 'text';

        // Try semantic search first if enabled and available
        if ($useSemanticSearch && $this->vectorSearch->isAvailable()) {
            $semanticResults = $this->vectorSearch->semanticSearch($q, 20);

            if ($semanticResults->isNotEmpty()) {
                $searchType = 'semantic';
                $results = $semanticResults->map(fn($r) => [
                    'id' => (string) $r->id,
                    'title' => $r->title_ar,
                    'type' => $r->category,
                    'excerpt' => mb_substr(strip_tags($r->content_ar), 0, 150),
                    'url' => $this->getContentUrl((object) ['id' => $r->id, 'category' => $r->category]),
                    'similarity' => round($r->similarity, 3),
                ]);
            }
        }

        // Fallback to text search if semantic search is disabled or returns no results
        if ($results->isEmpty()) {
            $searchType = 'text';
            $results = Content::where('status', 'published')
                ->where(function ($query) use ($q) {
                    $query->where('title_ar', 'like', "%{$q}%")
                        ->orWhere('title_en', 'like', "%{$q}%")
                        ->orWhere('content_ar', 'like', "%{$q}%")
                        ->orWhere('content_en', 'like', "%{$q}%");
                })
                ->limit(20)
                ->get()
                ->map(fn($r) => [
                    'id' => (string) $r->id,
                    'title' => $r->title_ar,
                    'type' => $r->category,
                    'excerpt' => mb_substr(strip_tags($r->content_ar), 0, 150),
                    'url' => $this->getContentUrl($r),
                ]);
        }

        return response()->json([
            'results' => $results,
            'total' => $results->count(),
            'search_type' => $searchType,
        ]);
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

    // Helper methods
    private function formatNews($n): array
    {
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
            'imageUrl' => $n->metadata['image'] ?? null,
            'isUrgent' => $n->priority >= 8,
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
}
