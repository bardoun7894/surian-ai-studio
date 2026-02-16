<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Faq;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SearchAutocompleteController extends Controller
{
    /**
     * T070: Get search autocomplete suggestions.
     *
     * Searches across Content (titles), Service (names), and FAQ (questions)
     * and returns up to 10 combined suggestions.
     *
     * GET /api/v1/public/search/autocomplete?q=...
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => 'required|string|min:2',
        ]);

        Log::info('Search autocomplete query', ['query' => $request->input('q'), 'ip' => $request->ip()]);

        $q = trim($validated['q']);

        // Sanitize the query for LIKE usage
        $searchTerm = '%' . str_replace(['%', '_'], ['\%', '\_'], $q) . '%';

        $cacheKey = 'search.autocomplete.' . md5($q);

        $suggestions = Cache::remember($cacheKey, 300, function () use ($searchTerm) {
            $suggestions = [];

            // 1. Search Content titles (limit 5) - news, announcements, decrees, etc.
            $contents = Content::published()
                ->where(function ($query) use ($searchTerm) {
                    $query->where('title_ar', 'like', $searchTerm)
                        ->orWhere('title_en', 'like', $searchTerm);
                })
                ->select('id', 'title_ar', 'title_en', 'category', 'slug')
                ->limit(5)
                ->get();

            foreach ($contents as $content) {
                $suggestions[] = [
                    'text' => $content->title_en ?: $content->title_ar,
                    'type' => $content->category,
                    'url' => $this->buildContentUrl($content),
                ];
            }

            // 2. Search Service names (limit 3)
            $services = Service::active()
                ->where(function ($query) use ($searchTerm) {
                    $query->where('name_ar', 'like', $searchTerm)
                        ->orWhere('name_en', 'like', $searchTerm);
                })
                ->select('id', 'name_ar', 'name_en')
                ->limit(3)
                ->get();

            foreach ($services as $service) {
                $suggestions[] = [
                    'text' => $service->name_en ?: $service->name_ar,
                    'type' => 'service',
                    'url' => '/services/' . $service->id,
                ];
            }

            // 3. Search FAQ questions (limit 2)
            $faqs = Faq::where('is_published', true)
                ->where('is_active', true)
                ->where(function ($query) use ($searchTerm) {
                    $query->where('question_ar', 'like', $searchTerm)
                        ->orWhere('question_en', 'like', $searchTerm);
                })
                ->select('id', 'question_ar', 'question_en')
                ->limit(2)
                ->get();

            foreach ($faqs as $faq) {
                $suggestions[] = [
                    'text' => $faq->question_en ?: $faq->question_ar,
                    'type' => 'faq',
                    'url' => '/faq',
                ];
            }

            return $suggestions;
        });

        return response()->json([
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * Build a frontend URL for a content item based on its category.
     */
    private function buildContentUrl(Content $content): string
    {
        $id = $content->slug ?: $content->id;

        return match ($content->category) {
            Content::CATEGORY_NEWS => '/news/' . $id,
            Content::CATEGORY_ANNOUNCEMENT => '/announcements/' . $id,
            Content::CATEGORY_DECREE => '/decrees/' . $id,
            Content::CATEGORY_SERVICE => '/services/' . $id,
            Content::CATEGORY_MEDIA => '/media/' . $id,
            Content::CATEGORY_FAQ => '/faq',
            Content::CATEGORY_PAGE, Content::CATEGORY_ABOUT => '/pages/' . $id,
            default => '/news/' . $id,
        };
    }
}
