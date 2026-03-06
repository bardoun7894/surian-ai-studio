<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    /**
     * BE-11: Track a content event (download, share, etc.)
     *
     * POST /api/v1/analytics/track
     */
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_type' => 'required|string|in:pdf_download,share_click,decree_download,attachment_download',
            'content_type' => 'nullable|string|max:50',
            'content_id' => 'nullable|integer',
            'metadata' => 'nullable|array',
            'metadata.platform' => 'nullable|string|in:facebook,twitter,whatsapp,telegram,copy_link,email',
        ]);

        DB::table('analytics_events')->insert([
            'event_type' => $validated['event_type'],
            'content_type' => $validated['content_type'] ?? null,
            'content_id' => $validated['content_id'] ?? null,
            'user_id' => auth()->id(),
            'ip' => $request->ip(),
            'metadata' => isset($validated['metadata']) ? json_encode($validated['metadata']) : null,
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Event tracked']);
    }

    /**
     * BE-11: Get content engagement analytics (admin)
     *
     * GET /api/v1/admin/analytics/content-engagement
     */
    public function contentEngagement(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $since = now()->subDays($days);

        $downloads = DB::table('analytics_events')
            ->where('event_type', 'like', '%download%')
            ->where('created_at', '>=', $since)
            ->count();

        $shares = DB::table('analytics_events')
            ->where('event_type', 'share_click')
            ->where('created_at', '>=', $since)
            ->count();

        $topContent = DB::table('analytics_events')
            ->select('content_type', 'content_id', DB::raw('count(*) as total'))
            ->where('created_at', '>=', $since)
            ->whereNotNull('content_id')
            ->groupBy('content_type', 'content_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $sharePlatforms = DB::table('analytics_events')
            ->select(DB::raw("metadata->>'platform' as platform"), DB::raw('count(*) as total'))
            ->where('event_type', 'share_click')
            ->where('created_at', '>=', $since)
            ->groupBy(DB::raw("metadata->>'platform'"))
            ->orderByDesc('total')
            ->get();

        $dailyTrend = DB::table('analytics_events')
            ->select(DB::raw("DATE(created_at) as date"), DB::raw('count(*) as total'))
            ->where('created_at', '>=', $since)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return response()->json([
            'period_days' => $days,
            'total_downloads' => $downloads,
            'total_shares' => $shares,
            'top_content' => $topContent,
            'share_platforms' => $sharePlatforms,
            'daily_trend' => $dailyTrend,
        ]);
    }
}
