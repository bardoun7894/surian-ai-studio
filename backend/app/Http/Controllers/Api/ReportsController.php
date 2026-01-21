<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Middleware\CheckDirectorate;
use App\Models\Complaint;
use App\Models\ComplaintSummary;
use App\Models\Content;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\Directorate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * FR-38: Get comprehensive statistics report
     * GET /api/v1/reports/statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();
        $userDirectorateId = CheckDirectorate::getUserDirectorateId($user);

        // Date range filter
        $startDate = $request->get('start_date')
            ? Carbon::parse($request->get('start_date'))
            : Carbon::now()->subDays(30);
        $endDate = $request->get('end_date')
            ? Carbon::parse($request->get('end_date'))
            : Carbon::now();

        $stats = [
            'period' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
            'complaints' => $this->getComplaintStats($userDirectorateId, $startDate, $endDate),
            'content' => $this->getContentStats($startDate, $endDate),
            'users' => $this->getUserStats(),
            'performance' => $this->getPerformanceStats($userDirectorateId, $startDate, $endDate),
        ];

        // Only include directorate breakdown for admins
        if ($userDirectorateId === null) {
            $stats['by_directorate'] = $this->getStatsByDirectorate($startDate, $endDate);
        }

        return response()->json($stats);
    }

    /**
     * Get complaint statistics
     */
    protected function getComplaintStats(?int $directorateId, Carbon $start, Carbon $end): array
    {
        $baseQuery = function () use ($directorateId) {
            $query = Complaint::query();
            if ($directorateId !== null) {
                $query->where('directorate_id', $directorateId);
            }
            return $query;
        };

        $periodQuery = function () use ($directorateId, $start, $end) {
            $query = Complaint::whereBetween('created_at', [$start, $end]);
            if ($directorateId !== null) {
                $query->where('directorate_id', $directorateId);
            }
            return $query;
        };

        return [
            'total' => $baseQuery()->count(),
            'period_total' => $periodQuery()->count(),
            'by_status' => [
                'new' => $baseQuery()->where('status', 'new')->count(),
                'received' => $baseQuery()->where('status', 'received')->count(),
                'in_progress' => $baseQuery()->where('status', 'in_progress')->count(),
                'resolved' => $baseQuery()->where('status', 'resolved')->count(),
                'rejected' => $baseQuery()->where('status', 'rejected')->count(),
                'closed' => $baseQuery()->where('status', 'closed')->count(),
            ],
            'by_priority' => [
                'high' => $baseQuery()->where('priority', 'high')->count(),
                'medium' => $baseQuery()->where('priority', 'medium')->count(),
                'low' => $baseQuery()->where('priority', 'low')->count(),
            ],
            'trend' => $this->getComplaintTrend($directorateId, $start, $end),
            'resolution_rate' => $this->calculateResolutionRate($directorateId),
        ];
    }

    /**
     * Get daily complaint trend
     */
    protected function getComplaintTrend(?int $directorateId, Carbon $start, Carbon $end): array
    {
        $query = Complaint::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date');

        if ($directorateId !== null) {
            $query->where('directorate_id', $directorateId);
        }

        return $query->get()->map(fn($item) => [
            'date' => $item->date,
            'count' => $item->count,
        ])->toArray();
    }

    /**
     * Calculate resolution rate
     */
    protected function calculateResolutionRate(?int $directorateId): array
    {
        $query = Complaint::query();
        if ($directorateId !== null) {
            $query->where('directorate_id', $directorateId);
        }

        $total = $query->count();
        $resolved = (clone $query)->whereIn('status', ['resolved', 'closed'])->count();

        return [
            'total' => $total,
            'resolved' => $resolved,
            'rate' => $total > 0 ? round(($resolved / $total) * 100, 1) : 0,
        ];
    }

    /**
     * Get content statistics
     */
    protected function getContentStats(Carbon $start, Carbon $end): array
    {
        return [
            'total' => Content::count(),
            'published' => Content::where('status', 'published')->count(),
            'draft' => Content::where('status', 'draft')->count(),
            'archived' => Content::where('status', 'archived')->count(),
            'by_category' => Content::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->get()
                ->pluck('count', 'category')
                ->toArray(),
            'period_published' => Content::where('status', 'published')
                ->whereBetween('published_at', [$start, $end])
                ->count(),
            'recent_updates' => Content::where('updated_at', '>=', Carbon::now()->subDays(7))
                ->count(),
        ];
    }

    /**
     * Get user statistics
     */
    protected function getUserStats(): array
    {
        return [
            'total' => User::count(),
            'active' => User::where('is_active', true)->count(),
            'inactive' => User::where('is_active', false)->count(),
            'by_role' => User::selectRaw('role_id, COUNT(*) as count')
                ->groupBy('role_id')
                ->with('role:id,name')
                ->get()
                ->map(fn($u) => [
                    'role' => $u->role?->name ?? 'citizen',
                    'count' => $u->count,
                ])
                ->toArray(),
            'registered_last_30_days' => User::where('created_at', '>=', Carbon::now()->subDays(30))
                ->count(),
        ];
    }

    /**
     * Get performance statistics
     */
    protected function getPerformanceStats(?int $directorateId, Carbon $start, Carbon $end): array
    {
        $query = Complaint::query();
        if ($directorateId !== null) {
            $query->where('directorate_id', $directorateId);
        }

        // Average resolution time (in days)
        $avgResolutionTime = (clone $query)
            ->whereNotNull('resolved_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400) as avg_days')
            ->value('avg_days');

        // Response time (first status change from 'new')
        $avgResponseTime = AuditLog::where('action', 'status_updated')
            ->where('entity_type', 'complaint')
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (created_at - (SELECT created_at FROM complaints WHERE id = entity_id))) / 3600) as avg_hours')
            ->value('avg_hours');

        return [
            'avg_resolution_days' => round($avgResolutionTime ?? 0, 1),
            'avg_response_hours' => round($avgResponseTime ?? 0, 1),
            'pending_count' => (clone $query)->whereIn('status', ['new', 'received'])->count(),
            'overdue_count' => (clone $query)
                ->whereIn('status', ['new', 'received', 'in_progress'])
                ->where('created_at', '<', Carbon::now()->subDays(7))
                ->count(),
        ];
    }

    /**
     * Get statistics by directorate (admin only)
     */
    protected function getStatsByDirectorate(Carbon $start, Carbon $end): array
    {
        return Directorate::all()->map(function ($directorate) use ($start, $end) {
            $complaintQuery = Complaint::where('directorate_id', $directorate->id);

            return [
                'id' => $directorate->id,
                'name' => $directorate->name_ar ?? $directorate->name,
                'complaints' => [
                    'total' => (clone $complaintQuery)->count(),
                    'period' => (clone $complaintQuery)
                        ->whereBetween('created_at', [$start, $end])
                        ->count(),
                    'pending' => (clone $complaintQuery)
                        ->whereIn('status', ['new', 'received', 'in_progress'])
                        ->count(),
                    'resolved' => (clone $complaintQuery)
                        ->whereIn('status', ['resolved', 'closed'])
                        ->count(),
                ],
            ];
        })->toArray();
    }

    /**
     * FR-38: Export statistics as CSV
     * GET /api/v1/reports/export
     */
    public function export(Request $request)
    {
        $user = $request->user();
        $userDirectorateId = CheckDirectorate::getUserDirectorateId($user);

        $startDate = $request->get('start_date')
            ? Carbon::parse($request->get('start_date'))
            : Carbon::now()->subDays(30);
        $endDate = $request->get('end_date')
            ? Carbon::parse($request->get('end_date'))
            : Carbon::now();

        $query = Complaint::with(['directorate', 'user'])
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($userDirectorateId !== null) {
            $query->where('directorate_id', $userDirectorateId);
        }

        $complaints = $query->get();

        $csv = "رقم التتبع,الحالة,الأولوية,المديرية,تاريخ الإنشاء,تاريخ الحل\n";

        foreach ($complaints as $complaint) {
            $csv .= implode(',', [
                $complaint->tracking_number,
                $complaint->status,
                $complaint->priority,
                $complaint->directorate?->name_ar ?? '',
                $complaint->created_at->format('Y-m-d H:i'),
                $complaint->resolved_at?->format('Y-m-d H:i') ?? '',
            ]) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="complaints_report.csv"');
    }

    /**
     * Get audit log summary
     * GET /api/v1/reports/audit
     */
    public function audit(Request $request): JsonResponse
    {
        $days = $request->get('days', 7);

        $logs = AuditLog::with('user:id,name')
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->get();

        $recentActivity = AuditLog::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(fn($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'entity_type' => $log->entity_type,
                'entity_id' => $log->entity_id,
                'user' => $log->user?->name ?? 'System',
                'created_at' => $log->created_at->toIso8601String(),
                'details' => $log->details,
            ]);

        return response()->json([
            'summary' => $logs,
            'recent_activity' => $recentActivity,
        ]);
    }

    /**
     * FR-39: Get AI-generated complaint summaries
     * GET /api/v1/reports/summaries
     */
    public function summaries(Request $request): JsonResponse
    {
        $user = $request->user();
        $userDirectorateId = CheckDirectorate::getUserDirectorateId($user);

        $type = $request->get('type', 'weekly'); // daily, weekly, monthly
        $limit = min((int) $request->get('limit', 10), 50);

        $query = ComplaintSummary::with('directorate:id,name_ar,name_en')
            ->ofType($type)
            ->orderBy('period_end', 'desc');

        // Filter by directorate if user is not admin
        if ($userDirectorateId !== null) {
            $query->where(function ($q) use ($userDirectorateId) {
                $q->where('directorate_id', $userDirectorateId)
                  ->orWhereNull('directorate_id'); // Also include overall summaries
            });
        }

        // Optional directorate filter for admins
        if ($request->has('directorate_id') && $userDirectorateId === null) {
            $query->where('directorate_id', $request->get('directorate_id'));
        }

        $summaries = $query->limit($limit)->get();

        return response()->json([
            'type' => $type,
            'summaries' => $summaries,
            'count' => $summaries->count(),
        ]);
    }

    /**
     * FR-39: Get the latest summary for dashboard display
     * GET /api/v1/reports/summaries/latest
     */
    public function latestSummary(Request $request): JsonResponse
    {
        $user = $request->user();
        $userDirectorateId = CheckDirectorate::getUserDirectorateId($user);

        $type = $request->get('type', 'weekly');
        $directorateId = $userDirectorateId ?? $request->get('directorate_id');

        // Get overall summary
        $overallSummary = ComplaintSummary::ofType($type)
            ->whereNull('directorate_id')
            ->orderBy('period_end', 'desc')
            ->first();

        // Get directorate-specific summary if applicable
        $directorateSummary = null;
        if ($directorateId) {
            $directorateSummary = ComplaintSummary::ofType($type)
                ->where('directorate_id', $directorateId)
                ->orderBy('period_end', 'desc')
                ->with('directorate:id,name_ar,name_en')
                ->first();
        }

        return response()->json([
            'type' => $type,
            'overall' => $overallSummary,
            'directorate' => $directorateSummary,
            'generated_at' => $overallSummary?->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * FR-39: Get a specific summary by ID
     * GET /api/v1/reports/summaries/{id}
     */
    public function showSummary(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $userDirectorateId = CheckDirectorate::getUserDirectorateId($user);

        $summary = ComplaintSummary::with('directorate:id,name_ar,name_en')->find($id);

        if (!$summary) {
            return response()->json(['message' => 'Summary not found'], 404);
        }

        // Check access for non-admin users
        if ($userDirectorateId !== null &&
            $summary->directorate_id !== null &&
            $summary->directorate_id !== $userDirectorateId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($summary);
    }
}
