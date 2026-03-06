<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        // General Stats
        $stats = [
            'total_users' => User::count(),
            'new_users_this_month' => User::whereMonth('created_at', now()->month)->count(),
            'total_complaints' => Complaint::count(),
            'resolved_complaints' => Complaint::where('status', 'resolved')->count(),
            'pending_complaints' => Complaint::whereIn('status', ['new', 'pending', 'processing'])->count(),
        ];

        // Complaints by Status Chart Data
        $complaintStatusData = Complaint::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Monthly Complaints Chart Data (Last 6 months) - PostgreSQL compatible
        $monthlyComplaints = Complaint::select(
            DB::raw('count(id) as count'),
            DB::raw("to_char(created_at, 'YYYY-MM') as month_year")
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month_year')
            ->orderBy('month_year')
            ->get();

        $monthlyLabels = $monthlyComplaints->pluck('month_year')->toArray();
        $monthlyData = $monthlyComplaints->pluck('count')->toArray();

        return view('admin.reports.index', compact('stats', 'complaintStatusData', 'monthlyLabels', 'monthlyData'));
    }
}
