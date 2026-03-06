<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AIAssistantController extends Controller
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function logs()
    {
        $conversations = ChatConversation::with('user')
            ->latest()
            ->paginate(20);

        return view('admin.ai.logs', compact('conversations'));
    }

    public function analytics()
    {
        $totalConversations = ChatConversation::count();
        $todayConversations = ChatConversation::whereDate('created_at', today())->count();

        // Get average messages per conversation
        $avgMessages = DB::table('chat_conversations')
            ->selectRaw('AVG(json_array_length(messages::json)) as avg')
            ->value('avg') ?? 0;

        // Get conversations with handoff requests
        $handoffRequests = ChatConversation::where('handoff_requested', true)->count();
        $handoffPending = ChatConversation::where('handoff_status', 'pending')->count();

        // Get weekly trend
        $weeklyTrend = ChatConversation::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $stats = [
            'total_conversations' => $totalConversations,
            'today_conversations' => $todayConversations,
            'avg_messages_per_conversation' => round($avgMessages, 1),
            'handoff_requests' => $handoffRequests,
            'handoff_pending' => $handoffPending,
            'weekly_trend' => $weeklyTrend,
        ];

        return view('admin.ai.analytics', compact('stats'));
    }

    /**
     * Generate AI report from chat conversations
     * POST /admin/dashboard/ai/generate-report
     */
    public function generateReport(Request $request)
    {
        $request->validate([
            'type' => 'required|in:summary,faq,sentiment',
            'period' => 'nullable|in:day,week,month',
        ]);

        $type = $request->input('type');
        $period = $request->input('period', 'week');

        // Get date range
        $startDate = match($period) {
            'day' => Carbon::now()->startOfDay(),
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
        };

        // Get conversations for the period
        $conversations = ChatConversation::where('created_at', '>=', $startDate)
            ->get();

        if ($conversations->isEmpty()) {
            return response()->json([
                'message' => 'لا توجد محادثات في الفترة المحددة',
                'report' => null,
            ]);
        }

        // Prepare conversation data for AI analysis
        $conversationTexts = $conversations->map(function ($conv) {
            $messages = $conv->messages ?? [];
            return collect($messages)->map(fn($m) => $m['content'] ?? '')->implode("\n");
        })->implode("\n---\n");

        // Generate report based on type
        $report = match($type) {
            'summary' => $this->generateSummaryReport($conversationTexts, $conversations->count()),
            'faq' => $this->generateFaqReport($conversationTexts),
            'sentiment' => $this->generateSentimentReport($conversationTexts, $conversations->count()),
        };

        return response()->json([
            'message' => 'تم إنشاء التقرير بنجاح',
            'report' => $report,
            'period' => $period,
            'conversations_analyzed' => $conversations->count(),
        ]);
    }

    protected function generateSummaryReport(string $texts, int $count): array
    {
        $summary = $this->aiService->summarize(
            "ملخص {$count} محادثة مع المواطنين:\n\n{$texts}",
            'ar'
        );

        return [
            'type' => 'summary',
            'title' => 'ملخص المحادثات',
            'content' => $summary ?? 'تعذر إنشاء الملخص',
            'total_conversations' => $count,
        ];
    }

    protected function generateFaqReport(string $texts): array
    {
        // Use AI to identify common questions
        $prompt = "استخرج الأسئلة الشائعة من المحادثات التالية:\n\n{$texts}";

        $result = $this->aiService->analyzeRecurringComplaints($prompt);

        return [
            'type' => 'faq',
            'title' => 'الأسئلة الشائعة المستخرجة',
            'questions' => $result['recurring_issues'] ?? [],
            'keywords' => $result['keywords'] ?? [],
        ];
    }

    protected function generateSentimentReport(string $texts, int $count): array
    {
        // Simple sentiment analysis based on keywords
        $positiveKeywords = ['شكرا', 'ممتاز', 'رائع', 'جيد', 'مساعدة', 'حل'];
        $negativeKeywords = ['سيء', 'مشكلة', 'لم يعمل', 'فشل', 'غير راضي', 'صعب'];

        $positiveCount = 0;
        $negativeCount = 0;

        foreach ($positiveKeywords as $keyword) {
            $positiveCount += substr_count($texts, $keyword);
        }
        foreach ($negativeKeywords as $keyword) {
            $negativeCount += substr_count($texts, $keyword);
        }

        $total = $positiveCount + $negativeCount;
        $sentiment = $total > 0 ? round(($positiveCount / $total) * 100) : 50;

        return [
            'type' => 'sentiment',
            'title' => 'تحليل المشاعر',
            'sentiment_score' => $sentiment,
            'positive_indicators' => $positiveCount,
            'negative_indicators' => $negativeCount,
            'total_conversations' => $count,
            'assessment' => $sentiment >= 70 ? 'إيجابي' : ($sentiment >= 40 ? 'محايد' : 'سلبي'),
        ];
    }
}
