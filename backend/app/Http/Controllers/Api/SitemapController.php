<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Directorate;
use App\Models\Service;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * M11: Generate dynamic sitemap.xml
     *
     * GET /sitemap.xml
     */
    public function sitemap(): Response
    {
        $xml = Cache::remember('sitemap_xml', 3600, function () {
            $frontendUrl = rtrim(config('app.frontend_url', 'https://moe.gov.sy'), '/');

            $urls = [];

            // Static pages
            $staticPages = [
                ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
                ['loc' => '/news', 'priority' => '0.9', 'changefreq' => 'daily'],
                ['loc' => '/announcements', 'priority' => '0.8', 'changefreq' => 'daily'],
                ['loc' => '/services', 'priority' => '0.8', 'changefreq' => 'weekly'],
                ['loc' => '/complaints', 'priority' => '0.7', 'changefreq' => 'monthly'],
                ['loc' => '/suggestions', 'priority' => '0.7', 'changefreq' => 'monthly'],
                ['loc' => '/directorates', 'priority' => '0.8', 'changefreq' => 'monthly'],
                ['loc' => '/media', 'priority' => '0.6', 'changefreq' => 'weekly'],
                ['loc' => '/decrees', 'priority' => '0.7', 'changefreq' => 'weekly'],
                ['loc' => '/faq', 'priority' => '0.6', 'changefreq' => 'monthly'],
                ['loc' => '/investment', 'priority' => '0.7', 'changefreq' => 'weekly'],
                ['loc' => '/contact', 'priority' => '0.5', 'changefreq' => 'monthly'],
                ['loc' => '/login', 'priority' => '0.3', 'changefreq' => 'yearly'],
                ['loc' => '/register', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ];

            foreach ($staticPages as $page) {
                $urls[] = [
                    'loc' => $frontendUrl . $page['loc'],
                    'lastmod' => now()->toAtomString(),
                    'changefreq' => $page['changefreq'],
                    'priority' => $page['priority'],
                ];
            }

            // News articles
            $news = Content::where('category', 'news')
                ->where('status', 'published')
                ->orderByDesc('published_at')
                ->limit(500)
                ->get(['id', 'slug', 'updated_at', 'published_at']);

            foreach ($news as $item) {
                $urls[] = [
                    'loc' => $frontendUrl . '/news/' . ($item->slug ?: $item->id),
                    'lastmod' => ($item->updated_at ?: $item->published_at)->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }

            // Announcements
            $announcements = Content::where('category', 'announcement')
                ->where('status', 'published')
                ->orderByDesc('published_at')
                ->limit(200)
                ->get(['id', 'slug', 'updated_at', 'published_at']);

            foreach ($announcements as $item) {
                $urls[] = [
                    'loc' => $frontendUrl . '/announcements/' . ($item->slug ?: $item->id),
                    'lastmod' => ($item->updated_at ?: $item->published_at)->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            }

            // Decrees
            $decrees = Content::where('category', 'decree')
                ->where('status', 'published')
                ->orderByDesc('published_at')
                ->limit(200)
                ->get(['id', 'slug', 'updated_at', 'published_at']);

            foreach ($decrees as $item) {
                $urls[] = [
                    'loc' => $frontendUrl . '/decrees/' . ($item->slug ?: $item->id),
                    'lastmod' => ($item->updated_at ?: $item->published_at)->toAtomString(),
                    'changefreq' => 'yearly',
                    'priority' => '0.5',
                ];
            }

            // Services
            $services = Service::where('is_active', true)
                ->get(['id', 'updated_at']);

            foreach ($services as $svc) {
                $urls[] = [
                    'loc' => $frontendUrl . '/services/' . $svc->id,
                    'lastmod' => $svc->updated_at?->toAtomString() ?? now()->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            }

            // Directorates
            $directorates = Directorate::where('is_active', true)
                ->get(['id', 'updated_at']);

            foreach ($directorates as $dir) {
                $urls[] = [
                    'loc' => $frontendUrl . '/directorates/' . $dir->id,
                    'lastmod' => $dir->updated_at?->toAtomString() ?? now()->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            }

            // Build XML
            $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

            foreach ($urls as $url) {
                $xml .= "  <url>\n";
                $xml .= "    <loc>" . htmlspecialchars($url['loc']) . "</loc>\n";
                $xml .= "    <lastmod>{$url['lastmod']}</lastmod>\n";
                $xml .= "    <changefreq>{$url['changefreq']}</changefreq>\n";
                $xml .= "    <priority>{$url['priority']}</priority>\n";
                $xml .= "  </url>\n";
            }

            $xml .= '</urlset>';

            return $xml;
        });

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * M11: Generate robots.txt
     *
     * GET /robots.txt
     */
    public function robots(): Response
    {
        $frontendUrl = rtrim(config('app.frontend_url', 'https://moe.gov.sy'), '/');

        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /api/\n";
        $content .= "Disallow: /login\n";
        $content .= "Disallow: /register\n";
        $content .= "Disallow: /profile\n";
        $content .= "\n";
        $content .= "Sitemap: {$frontendUrl}/sitemap.xml\n";

        return response($content, 200)
            ->header('Content-Type', 'text/plain');
    }
}
