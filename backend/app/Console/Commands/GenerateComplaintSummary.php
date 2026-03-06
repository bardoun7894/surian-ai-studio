<?php

namespace App\Console\Commands;

use App\Models\Complaint;
use App\Models\ComplaintSummary;
use App\Models\Directorate;
use App\Services\AIService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateComplaintSummary extends Command
{
    protected $signature = 'complaints:generate-summary
                            {--type=weekly : Period type (daily, weekly, monthly)}
                            {--directorate= : Specific directorate ID (optional)}
                            {--all-directorates : Generate for all directorates}';

    protected $description = 'FR-39: Generate AI summary of recurring complaints';

    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        parent::__construct();
        $this->aiService = $aiService;
    }

    public function handle(): int
    {
        $type = $this->option('type');
        $directorateId = $this->option('directorate');
        $allDirectorates = $this->option('all-directorates');

        // Calculate period based on type
        $period = $this->calculatePeriod($type);

        $this->info("Generating {$type} complaint summary for period: {$period['start']->format('Y-m-d')} to {$period['end']->format('Y-m-d')}");

        if ($allDirectorates) {
            // Generate summary for each directorate + overall
            $directorates = Directorate::all();

            foreach ($directorates as $directorate) {
                $this->generateSummary($period, $type, $directorate->id);
            }

            // Generate overall summary (no directorate filter)
            $this->generateSummary($period, $type, null);

            $this->info("Generated summaries for {$directorates->count()} directorates + overall");
        } elseif ($directorateId) {
            $this->generateSummary($period, $type, (int) $directorateId);
        } else {
            // Generate overall summary only
            $this->generateSummary($period, $type, null);
        }

        return Command::SUCCESS;
    }

    protected function calculatePeriod(string $type): array
    {
        $end = Carbon::now()->endOfDay();

        switch ($type) {
            case 'daily':
                $start = Carbon::now()->startOfDay();
                break;
            case 'weekly':
                $start = Carbon::now()->subWeek()->startOfDay();
                break;
            case 'monthly':
                $start = Carbon::now()->subMonth()->startOfDay();
                break;
            default:
                $start = Carbon::now()->subWeek()->startOfDay();
        }

        return ['start' => $start, 'end' => $end];
    }

    protected function generateSummary(array $period, string $type, ?int $directorateId): void
    {
        $directorateName = $directorateId
            ? Directorate::find($directorateId)?->name_ar ?? "مديرية #{$directorateId}"
            : 'جميع المديريات';

        $this->line("  Processing: {$directorateName}...");

        // Build base query
        $query = Complaint::whereBetween('created_at', [$period['start'], $period['end']]);

        if ($directorateId) {
            $query->where('directorate_id', $directorateId);
        }

        // Gather statistics
        $stats = $this->gatherStatistics($query->clone(), $period);

        if ($stats['total'] === 0) {
            $this->line("    No complaints found for this period. Skipping.");
            return;
        }

        // Get complaint descriptions for AI analysis
        $complaints = $query->clone()
            ->select('description', 'ai_category', 'priority', 'status')
            ->limit(100) // Limit for AI processing
            ->get();

        // Generate AI analysis
        $aiAnalysis = $this->generateAIAnalysis($complaints, $stats, $directorateName);

        // Check for existing summary (to update or create)
        $existingSummary = ComplaintSummary::where('period_type', $type)
            ->where('period_start', $period['start']->format('Y-m-d'))
            ->where('period_end', $period['end']->format('Y-m-d'))
            ->where('directorate_id', $directorateId)
            ->first();

        $summaryData = [
            'period_type' => $type,
            'period_start' => $period['start'],
            'period_end' => $period['end'],
            'directorate_id' => $directorateId,
            'total_complaints' => $stats['total'],
            'resolved_count' => $stats['resolved'],
            'pending_count' => $stats['pending'],
            'status_breakdown' => $stats['by_status'],
            'priority_breakdown' => $stats['by_priority'],
            'top_categories' => $stats['top_categories'],
            'recurring_issues' => $aiAnalysis['recurring_issues'] ?? [],
            'ai_summary_ar' => $aiAnalysis['summary_ar'] ?? null,
            'ai_summary_en' => $aiAnalysis['summary_en'] ?? null,
            'ai_recommendations' => $aiAnalysis['recommendations'] ?? null,
            'keywords' => $aiAnalysis['keywords'] ?? [],
            'avg_resolution_days' => $stats['avg_resolution_days'],
            'ai_confidence' => $aiAnalysis['confidence'] ?? 0.5,
        ];

        if ($existingSummary) {
            $existingSummary->update($summaryData);
            $this->line("    Updated existing summary (ID: {$existingSummary->id})");
        } else {
            $summary = ComplaintSummary::create($summaryData);
            $this->line("    Created new summary (ID: {$summary->id})");
        }

        Log::info("Generated complaint summary", [
            'type' => $type,
            'directorate_id' => $directorateId,
            'total_complaints' => $stats['total'],
        ]);
    }

    protected function gatherStatistics($query, array $period): array
    {
        $total = $query->clone()->count();

        $byStatus = $query->clone()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $byPriority = $query->clone()
            ->selectRaw('priority, COUNT(*) as count')
            ->groupBy('priority')
            ->pluck('count', 'priority')
            ->toArray();

        $topCategories = $query->clone()
            ->selectRaw('ai_category, COUNT(*) as count')
            ->whereNotNull('ai_category')
            ->groupBy('ai_category')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(fn($item) => ['category' => $item->ai_category, 'count' => $item->count])
            ->toArray();

        $resolved = ($byStatus['resolved'] ?? 0) + ($byStatus['closed'] ?? 0);
        $pending = $total - $resolved - ($byStatus['rejected'] ?? 0);

        // Average resolution time
        $avgResolution = $query->clone()
            ->whereNotNull('updated_at')
            ->whereIn('status', ['resolved', 'closed'])
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) as avg_days')
            ->value('avg_days');

        return [
            'total' => $total,
            'resolved' => $resolved,
            'pending' => $pending,
            'by_status' => $byStatus,
            'by_priority' => $byPriority,
            'top_categories' => $topCategories,
            'avg_resolution_days' => round($avgResolution ?? 0, 2),
        ];
    }

    protected function generateAIAnalysis($complaints, array $stats, string $directorateName): array
    {
        if ($complaints->isEmpty()) {
            return [
                'recurring_issues' => [],
                'summary_ar' => null,
                'summary_en' => null,
                'recommendations' => null,
                'keywords' => [],
                'confidence' => 0,
            ];
        }

        // Prepare complaint texts for AI
        $complaintTexts = $complaints->pluck('description')->implode("\n---\n");
        $categories = $complaints->pluck('ai_category')->filter()->unique()->values()->toArray();

        try {
            // Call AI service for analysis
            $prompt = $this->buildAnalysisPrompt($complaintTexts, $stats, $directorateName, $categories);
            $aiResponse = $this->aiService->analyzeRecurringComplaints($prompt);

            if ($aiResponse) {
                return $aiResponse;
            }
        } catch (\Exception $e) {
            Log::error("AI analysis failed for complaint summary: {$e->getMessage()}");
        }

        // Fallback analysis
        return $this->fallbackAnalysis($complaints, $stats, $categories);
    }

    protected function buildAnalysisPrompt(string $complaints, array $stats, string $directorate, array $categories): string
    {
        return "تحليل الشكاوى المتكررة:\n\n" .
               "المديرية: {$directorate}\n" .
               "إجمالي الشكاوى: {$stats['total']}\n" .
               "المحلولة: {$stats['resolved']}\n" .
               "المعلقة: {$stats['pending']}\n" .
               "التصنيفات: " . implode(', ', $categories) . "\n\n" .
               "نصوص الشكاوى:\n{$complaints}\n\n" .
               "المطلوب:\n" .
               "1. تحديد المشاكل المتكررة\n" .
               "2. ملخص بالعربية\n" .
               "3. ملخص بالإنجليزية\n" .
               "4. توصيات للتحسين\n" .
               "5. الكلمات المفتاحية الشائعة";
    }

    protected function fallbackAnalysis($complaints, array $stats, array $categories): array
    {
        // Extract common words from descriptions
        $allText = $complaints->pluck('description')->implode(' ');
        $words = preg_split('/\s+/', $allText);
        $wordCounts = array_count_values($words);
        arsort($wordCounts);

        // Filter out common Arabic stop words and short words
        $stopWords = ['من', 'في', 'على', 'إلى', 'أن', 'هذا', 'هذه', 'التي', 'الذي', 'و', 'أو', 'لا', 'ما', 'عن'];
        $keywords = [];
        foreach ($wordCounts as $word => $count) {
            if (mb_strlen($word) > 3 && !in_array($word, $stopWords) && count($keywords) < 10) {
                $keywords[] = $word;
            }
        }

        // Generate basic summary
        $summaryAr = "تم استلام {$stats['total']} شكوى خلال هذه الفترة. " .
                     "تم حل {$stats['resolved']} شكوى. " .
                     "لا يزال هناك {$stats['pending']} شكوى قيد المعالجة.";

        if (!empty($categories)) {
            $summaryAr .= " أبرز التصنيفات: " . implode('، ', array_slice($categories, 0, 3)) . ".";
        }

        $summaryEn = "Received {$stats['total']} complaints during this period. " .
                     "{$stats['resolved']} resolved. " .
                     "{$stats['pending']} still pending.";

        return [
            'recurring_issues' => array_map(fn($cat) => [
                'issue' => $cat,
                'count' => collect($complaints)->where('ai_category', $cat)->count(),
            ], $categories),
            'summary_ar' => $summaryAr,
            'summary_en' => $summaryEn,
            'recommendations' => "يُنصح بمراجعة الشكاوى المتكررة في التصنيفات الأعلى وتطوير إجراءات استباقية.",
            'keywords' => $keywords,
            'confidence' => 0.5,
        ];
    }
}
