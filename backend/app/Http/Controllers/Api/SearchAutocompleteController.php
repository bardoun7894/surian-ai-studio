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
     * M7.1: Returns suggestions in the language matching the query (Arabic/English).
     * M7.4: Only returns published/active content with valid routes.
     *
     * GET /api/v1/public/search/autocomplete?q=...&lang=ar|en
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => 'required|string|min:2',
            'lang' => 'nullable|string|in:ar,en',
        ]);

        Log::info('Search autocomplete query', ['query' => $request->input('q'), 'lang' => $request->input('lang'), 'ip' => $request->ip()]);

        $q = trim($validated['q']);
        // M7.1: Detect language - if explicitly provided use it, otherwise auto-detect
        $lang = $validated['lang'] ?? $this->detectLanguage($q);

        // Sanitize the query for LIKE usage
        $searchTerm = '%' . str_replace(['%', '_'], ['\%', '\_'], $q) . '%';

        $cacheKey = 'search.autocomplete.' . md5($q . '_' . $lang);

        $suggestions = Cache::remember($cacheKey, 300, function () use ($searchTerm, $lang, $q) {
            $suggestions = [];

            // M7.4: Only include categories that have valid frontend routes
            $validCategories = [
                Content::CATEGORY_NEWS,
                Content::CATEGORY_ANNOUNCEMENT,
                Content::CATEGORY_DECREE,
                Content::CATEGORY_FAQ,
            ];

            // 1. Search Content titles (limit 5) - news, announcements, decrees
            // M7.4: Filter to only published + active content with valid categories
            $contents = Content::published()
                ->active()
                ->whereIn('category', $validCategories)
                ->where(function ($query) use ($searchTerm) {
                    $query->where('title_ar', 'like', $searchTerm)
                        ->orWhere('title_en', 'like', $searchTerm);
                })
                ->select('id', 'title_ar', 'title_en', 'category', 'slug')
                ->orderByRaw($this->titleRelevanceOrder($q, $lang))
                ->limit(5)
                ->get();

            foreach ($contents as $content) {
                // M7.1: Return text in the detected/requested language
                $text = $this->getLocalizedText(
                    $content->title_ar,
                    $content->title_en,
                    $lang
                );
                if (!$text) continue; // Skip if no text in target language

                $suggestions[] = [
                    'text' => $text,
                    'text_ar' => $content->title_ar,
                    'text_en' => $content->title_en,
                    'type' => $content->category,
                    'url' => $this->buildContentUrl($content),
                ];
            }

            // 2. Search Service names (limit 3)
            // M7.4: Only active services
            $services = Service::active()
                ->where(function ($query) use ($searchTerm) {
                    $query->where('name_ar', 'like', $searchTerm)
                        ->orWhere('name_en', 'like', $searchTerm);
                })
                ->select('id', 'name_ar', 'name_en')
                ->limit(3)
                ->get();

            foreach ($services as $service) {
                $text = $this->getLocalizedText(
                    $service->name_ar,
                    $service->name_en,
                    $lang
                );
                if (!$text) continue;

                $suggestions[] = [
                    'text' => $text,
                    'text_ar' => $service->name_ar,
                    'text_en' => $service->name_en,
                    'type' => 'service',
                    'url' => '/services/' . $service->id,
                ];
            }

            // 3. Search FAQ questions (limit 2)
            // M7.4: Only published + active FAQs
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
                $text = $this->getLocalizedText(
                    $faq->question_ar,
                    $faq->question_en,
                    $lang
                );
                if (!$text) continue;

                $suggestions[] = [
                    'text' => $text,
                    'text_ar' => $faq->question_ar,
                    'text_en' => $faq->question_en,
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
     * M7.1: Detect whether the query is Arabic or English based on character analysis.
     */
    private function detectLanguage(string $text): string
    {
        // Count Arabic characters (Unicode range for Arabic script)
        $arabicCount = preg_match_all('/[\x{0600}-\x{06FF}\x{0750}-\x{077F}\x{08A0}-\x{08FF}\x{FB50}-\x{FDFF}\x{FE70}-\x{FEFF}]/u', $text);
        // Count Latin characters
        $latinCount = preg_match_all('/[a-zA-Z]/', $text);

        return $arabicCount > $latinCount ? 'ar' : 'en';
    }

    /**
     * M7.1: Get text in the preferred language, falling back to the other.
     */
    private function getLocalizedText(?string $textAr, ?string $textEn, string $lang): ?string
    {
        if ($lang === 'ar') {
            return $textAr ?: $textEn;
        }
        return $textEn ?: $textAr;
    }

    /**
     * M7.5: Build an ORDER BY clause that prioritizes title matches over content matches.
     * Exact prefix matches rank highest, then contains matches.
     */
    private function titleRelevanceOrder(string $q, string $lang): string
    {
        $escaped = str_replace("'", "''", $q);
        $field = $lang === 'ar' ? 'title_ar' : 'title_en';
        $otherField = $lang === 'ar' ? 'title_en' : 'title_ar';

        // Priority: exact match > starts with > contains in primary lang > contains in other lang
        return "CASE
            WHEN LOWER({$field}) = LOWER('{$escaped}') THEN 1
            WHEN LOWER({$field}) LIKE LOWER('{$escaped}%') THEN 2
            WHEN LOWER({$field}) LIKE LOWER('%{$escaped}%') THEN 3
            WHEN LOWER({$otherField}) LIKE LOWER('%{$escaped}%') THEN 4
            ELSE 5
        END ASC";
    }

    /**
     * Build a frontend URL for a content item based on its category.
     * M7.4: Only generates URLs for categories with valid frontend routes.
     */
    private function buildContentUrl(Content $content): string
    {
        $id = $content->slug ?: $content->id;

        return match ($content->category) {
            Content::CATEGORY_NEWS => '/news/' . $id,
            Content::CATEGORY_ANNOUNCEMENT => '/announcements/' . $id,
            Content::CATEGORY_DECREE => '/decrees/' . $id,
            Content::CATEGORY_FAQ => '/faq',
            default => '/search?q=' . urlencode($content->title_ar ?? ''),
        };
    }
}
