<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Complaint;
use App\Models\Content;
use App\Models\ChatConversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard (ministry_backend_home_dashboard)
     */
    public function index()
    {
        $stats = $this->getStatsData();
        $chartData = $this->getComplaintsTrendData();
        $recentActivity = $this->getRecentActivityData();
        $pendingActions = $this->getPendingActionsData();
        
        return view('admin.dashboard', compact('stats', 'chartData', 'recentActivity', 'pendingActions'));
    }
    
    /**

     * Get dashboard statistics
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        
        if (empty($query)) {
            return redirect()->route('admin.dashboard');
        }
        
        $users = \App\Models\User::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->limit(5)
            ->get();
            
        $contents = \App\Models\Content::where('title_ar', 'like', "%{$query}%")
            ->orWhere('title_en', 'like', "%{$query}%")
            ->limit(5)
            ->get();
            
        $complaints = \App\Models\Complaint::where('title', 'like', "%{$query}%")
            ->orWhere('tracking_number', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->limit(5)
            ->get();
            
        return view('admin.search.results', compact('query', 'users', 'contents', 'complaints'));
    }

    public function getStats()
    {
        return response()->json($this->getStatsData());
    }
    
    /**
     * Get chart data for complaints trend
     */
    public function getChartData()
    {
        return response()->json($this->getComplaintsTrendData());
    }
    
    /**
     * Get recent activity feed
     */
    public function getActivityFeed()
    {
        return response()->json($this->getRecentActivityData());
    }
    
    /**
     * Private helper: Get statistics data
     */
    private function getStatsData()
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('admin');
        
        return [
            'total_users' => User::count(),
            'pending_complaints' => Complaint::whereIn('status', ['new', 'pending'])->count(),
            'urgent_complaints' => Complaint::whereIn('status', ['new', 'pending'])->whereIn('priority', ['high', 'urgent'])->count(),
            'today_content' => Content::whereDate('created_at', today())->count(),
            'today_conversations' => ChatConversation::whereDate('created_at', today())->count(),
        ];
    }
    
    /**
     * Private helper: Get complaints trend data (last 7 days)
     */
    private function getComplaintsTrendData()
    {
        $user = auth()->user();
        $query = Complaint::query();
        
        // Apply directorate scoping
        if (!$user->hasRole('admin') && $user->directorate_id) {
            $query->where('directorate_id', $user->directorate_id);
        }
        
        $data = $query->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subDays(7))
        ->groupBy('date')
        ->orderBy('date')
        ->get();
        
        // Fill in missing days
        $labels = [];
        $counts = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $dayData = $data->firstWhere('date', $dateStr);
            
            // Format label in Arabic Day
            $labels[] = $date->locale('ar')->isoFormat('dddd');
            $counts[] = $dayData ? $dayData->count : 0;
        }
        
        return [
            'labels' => $labels,
            'data' => $counts
        ];
    }
    
    /**
     * Private helper: Get recent activity data
     */
    private function getRecentActivityData()
    {
        $activities = [];
        
        // Recent content updates
        $recentContent = Content::with('author')
            ->latest('updated_at')
            ->take(3)
            ->get();
            
        foreach ($recentContent as $content) {
            $activities[] = [
                'type' => 'content',
                'description' => "تحديث محتوى: {$content->title_ar}", // Use Arabic title
                'time' => $content->updated_at->locale('ar')->diffForHumans(),
            ];
        }
        
        // Recent user registrations
        $recentUsers = User::latest('created_at')->take(2)->get();
        foreach ($recentUsers as $user) {
            $activities[] = [
                'type' => 'user',
                'description' => "تسجيل مستخدم جديد #{$user->id}",
                'time' => $user->created_at->locale('ar')->diffForHumans(),
            ];
        }
        
        // Mock Complaint activities if empty
        if (empty($activities)) {
             $activities[] = [
                'type' => 'complaint',
                'description' => 'تم استلام شكوى جديدة #1204',
                'time' => now()->subMinutes(5)->locale('ar')->diffForHumans(),
            ];
        }

        return collect($activities)->sortByDesc('time')->values()->all();
    }
    
    /**
     * Private helper: Get pending actions/tasks
     */
    private function getPendingActionsData()
    {
        return [
            [
                'id' => 1,
                'title' => 'الموافقة على البيان الصحفي',
                'type' => 'content',
                'date' => now()->locale('ar')->isoFormat('D MMMM'),
                'completed' => false,
            ],
            [
                'id' => 2,
                'title' => 'تدقيق هوية المستخدم #9921',
                'type' => 'user',
                'date' => now()->subDay()->locale('ar')->isoFormat('D MMMM'),
                'completed' => true,
            ],
            [
                'id' => 3,
                'title' => 'تصعيد الشكوى رقم #441',
                'type' => 'complaint',
                'date' => now()->subDays(2)->locale('ar')->isoFormat('D MMMM'),
                'completed' => false,
                'priority' => 'high',
            ],
        ];
    }
}
