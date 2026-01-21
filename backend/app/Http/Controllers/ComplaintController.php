<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintTemplate;
use App\Services\ComplaintService;
use App\Services\AuditService;
use App\Services\RecaptchaService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ComplaintController extends Controller
{
    protected $complaintService;
    protected $auditService;
    protected $recaptchaService;
    protected $notificationService;

    public function __construct(
        ComplaintService $complaintService,
        AuditService $auditService,
        RecaptchaService $recaptchaService,
        NotificationService $notificationService
    ) {
        $this->complaintService = $complaintService;
        $this->auditService = $auditService;
        $this->recaptchaService = $recaptchaService;
        $this->notificationService = $notificationService;
    }

    public function indexTemplates()
    {
        $templates = ComplaintTemplate::where('is_active', true)->with('directorate')->get();
        return response()->json($templates);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'national_id' => 'required|string',
        ]);

        $key = "complaint_otp_{$request->national_id}";

        if (RateLimiter::tooManyAttempts($key, 3)) { // 3 attempts per minute
             throw ValidationException::withMessages([
                'phone' => ['Too many OTP requests. Try again later.'],
            ]);
        }
        RateLimiter::hit($key, 60);

        $otp = (string) random_int(100000, 999999);
        
        // Store OTP in cache for 10 minutes
        Cache::put($key, $otp, 600);
        Cache::put("complaint_data_{$request->national_id}", $request->only('phone', 'national_id'), 600);

        Log::info("Guest OTP for {$request->national_id}: {$otp}");
        // Send SMS logic here

        return response()->json(['message' => 'OTP sent.', 'req_key' => $request->national_id]); // returning national_id as key for simplicity
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'national_id' => 'required|string',
            'otp' => 'required|string',
        ]);

        $key = "complaint_otp_{$request->national_id}";
        $cachedOtp = Cache::get($key);

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            throw ValidationException::withMessages([
                'otp' => ['Invalid or expired OTP.'],
            ]);
        }

        // Generate a Guest Token (valid for 1 hour)
        $token = Str::random(60);
        $userData = Cache::get("complaint_data_{$request->national_id}");
        
        Cache::put("guest_token_{$token}", $userData, 3600);
        Cache::forget($key); // Invalidate OTP

        return response()->json([
            'message' => 'OTP verified.',
            'guest_token' => $token
        ]);
    }

    public function store(Request $request)
    {
        // Rate Limiting (T050): 3 complaints per day per user/IP
        $limiterKey = 'complaint_submit_' . ($request->user() ? $request->user()->id : $request->ip());
        if (RateLimiter::tooManyAttempts($limiterKey, 3)) { // 3 per day ?? RateLimiter is usually per minute. 
             // For daily limit, we might need a custom cache key or higher decaySeconds (86400)
             // Using decaySeconds = 86400 (1 day)
        }
        
        if (RateLimiter::tooManyAttempts($limiterKey, 3)) {
             return response()->json(['message' => 'Daily complaint limit reached.'], 429);
        }

        // Validate Request including CAPTCHA
        $request->validate([
            'directorate_id' => 'required|exists:directorates,id',
            'description' => 'required|string|min:10',
            // Files validation T057, T058
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120', // 5MB max
            'attachments' => 'max:5', // Max 5 files
            'recaptcha_token' => 'nullable|string', // Optional pending Config
        ]);

        // Verify CAPTCHA (T060)
        if ($request->filled('recaptcha_token')) {
             if (!$this->recaptchaService->verify($request->recaptcha_token, $request->ip())) {
                 throw ValidationException::withMessages([
                     'recaptcha_token' => ['CAPTCHA verification failed.'],
                 ]);
             }
        }

        // Identity resolution
        $user = $request->user();
        $guestData = null;

        if (!$user) {
            // Check Guest Token
            $token = $request->header('X-Guest-Token');
            if (!$token || !($guestData = Cache::get("guest_token_{$token}"))) {
                return response()->json(['message' => 'Unauthorized. Login or verify OTP.'], 401);
            }
        }

        $data = $request->only(['directorate_id', 'template_id', 'title', 'description']);
        
        if ($user) {
            $data['user_id'] = $user->id;
            $data['full_name'] = $user->name;
            $data['national_id'] = $user->national_id;
            $data['phone'] = $user->phone;
            $data['email'] = $user->email;
        } else {
            $data['user_id'] = null;
            $data['full_name'] = $request->input('full_name', 'Guest'); // Should request this or use from OTP data?
            $data['national_id'] = $guestData['national_id'];
            $data['phone'] = $guestData['phone'];
            $data['email'] = $request->input('email');
        }

        $files = $request->file('attachments', []);

        $complaint = $this->complaintService->createComplaint($data, $files);

        RateLimiter::hit($limiterKey, 86400); // 1 day decay

        // Audit Log
        $actorId = $user ? $user->id : null;
        $this->auditService->log(
            $user, 
            'complaint_submitted', 
            'complaint', 
            $complaint->id, 
            ['tracking_number' => $complaint->tracking_number]
        );

        return response()->json([
            'message' => 'Complaint submitted successfully.',
            'tracking_number' => $complaint->tracking_number,
            'complaint' => $complaint
        ], 201);
    }

    /**
     * Track complaint by tracking number
     * GET /api/v1/complaints/track/{trackingNumber}
     */
    public function track($trackingNumber)
    {
        $complaint = Complaint::where('tracking_number', $trackingNumber)
            ->with(['directorate', 'responses'])
            ->first();

        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }

        return response()->json($complaint);
    }

    /**
     * Get authenticated user's complaints
     * GET /api/v1/users/me/complaints
     */
    public function myComplaints(Request $request)
    {
        return response()->json($request->user()->complaints()->with('directorate')->get());
    }

    /**
     * List all complaints for staff (with filtering)
     * FR-26: Staff can only see complaints from their directorate
     * GET /api/v1/staff/complaints
     */
    public function listAllComplaints(Request $request)
    {
        $user = $request->user();
        $query = Complaint::with(['directorate', 'user', 'template']);

        // FR-26: Apply directorate filter for non-admin staff
        $userDirectorateId = \App\Http\Middleware\CheckDirectorate::getUserDirectorateId($user);
        if ($userDirectorateId !== null) {
            $query->where('directorate_id', $userDirectorateId);
        }

        // Additional filters from request
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Only allow directorate filter if user is admin (can see all)
        if ($request->has('directorate_id') && $userDirectorateId === null) {
            $query->where('directorate_id', $request->directorate_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%");
            });
        }

        $complaints = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($complaints);
    }

    /**
     * Update complaint status
     * PUT /api/v1/staff/complaints/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string|in:new,received,in_progress,resolved,rejected,closed']);
        $complaint = Complaint::findOrFail($id);

        $oldStatus = $complaint->status;
        $newStatus = $request->status;

        // Only proceed if status actually changed
        if ($oldStatus === $newStatus) {
            return response()->json(['message' => 'Status unchanged', 'complaint' => $complaint]);
        }

        $complaint->status = $newStatus;
        $complaint->save();

        $this->auditService->log($request->user(), 'status_updated', 'complaint', $id, [
            'old_status' => $oldStatus,
            'new_status' => $newStatus
        ]);

        // FR-48: Notify citizen about status change
        try {
            $this->notificationService->notifyStatusChange($complaint, $oldStatus, $newStatus);
        } catch (\Exception $e) {
            Log::error("Failed to notify status change for complaint #{$complaint->tracking_number}: {$e->getMessage()}");
        }

        return response()->json(['message' => 'Status updated', 'complaint' => $complaint]);
    }

    /**
     * Update complaint categorization (Manual AI Override)
     * PUT /api/v1/staff/complaints/{id}/categorization
     */
    public function updateCategorization(Request $request, $id)
    {
        $request->validate([
            'ai_category' => 'required|string',
            'priority' => 'required|string|in:high,medium,low'
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->ai_category = $request->ai_category;
        $complaint->priority = $request->priority;
        $complaint->save();

        $this->auditService->log($request->user(), 'categorization_updated', 'complaint', $id, [
            'category' => $request->ai_category,
            'priority' => $request->priority
        ]);

        return response()->json(['message' => 'Categorization updated']);
    }

    /**
     * Get audit logs for a specific complaint
     * GET /api/v1/staff/complaints/{id}/logs
     */
    public function getComplaintLogs(Request $request, $id)
    {
        $logs = \App\Models\AuditLog::where('entity_type', 'complaint')
            ->where('entity_id', $id)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($logs);
    }

    /**
     * Add staff response to complaint
     * POST /api/v1/staff/complaints/{id}/response
     */
    public function addResponse(Request $request, $id)
    {
        $request->validate(['response' => 'required|string']);
        $complaint = Complaint::findOrFail($id);
        
        $complaint->responses()->create([
            'user_id' => $request->user()->id,
            'content' => $request->response
        ]);

        // Auto-set status to resolved if explicitly asked or handled
        // For now, just add the response

        return response()->json(['message' => 'Response added']);
    }

    /**
     * Get dashboard analytics for staff
     * FR-26: Stats are scoped to user's directorate
     * GET /api/v1/staff/analytics
     */
    public function getDashboardAnalytics(Request $request)
    {
        $user = $request->user();
        $userDirectorateId = \App\Http\Middleware\CheckDirectorate::getUserDirectorateId($user);

        // Base query with optional directorate filter
        $baseQuery = function () use ($userDirectorateId) {
            $query = Complaint::query();
            if ($userDirectorateId !== null) {
                $query->where('directorate_id', $userDirectorateId);
            }
            return $query;
        };

        $stats = [
            'total' => $baseQuery()->count(),
            'new' => $baseQuery()->where('status', 'new')->count(),
            'received' => $baseQuery()->where('status', 'received')->count(),
            'in_progress' => $baseQuery()->where('status', 'in_progress')->count(),
            'resolved' => $baseQuery()->where('status', 'resolved')->count(),
            'rejected' => $baseQuery()->where('status', 'rejected')->count(),
            'closed' => $baseQuery()->where('status', 'closed')->count(),
            'by_priority' => [
                'high' => $baseQuery()->where('priority', 'high')->count(),
                'medium' => $baseQuery()->where('priority', 'medium')->count(),
                'low' => $baseQuery()->where('priority', 'low')->count(),
            ],
            'by_category' => $baseQuery()
                ->selectRaw('ai_category, count(*) as count')
                ->groupBy('ai_category')
                ->get(),
            'recent_7_days' => $baseQuery()
                ->where('created_at', '>=', now()->subDays(7))
                ->count(),
            'avg_resolution_days' => $baseQuery()
                ->whereNotNull('resolved_at')
                ->selectRaw('AVG(EXTRACT(DAY FROM (resolved_at - created_at))) as avg_days')
                ->value('avg_days') ?? 0,
        ];

        // Only include by_directorate for admins (who can see all)
        if ($userDirectorateId === null) {
            $stats['by_directorate'] = Complaint::selectRaw('directorate_id, count(*) as count')
                ->groupBy('directorate_id')
                ->get()
                ->map(function ($item) {
                    $item->directorate = \App\Models\Directorate::find($item->directorate_id);
                    return $item;
                });
        }

        return response()->json($stats);
    }

    /**
     * FR-28: Print complaint as HTML (for printing or PDF conversion)
     * GET /api/v1/complaints/{trackingNumber}/print
     */
    public function print($trackingNumber)
    {
        $complaint = Complaint::where('tracking_number', $trackingNumber)
            ->with(['directorate', 'user', 'responses.user', 'attachments'])
            ->first();

        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }

        $statusLabels = [
            'new' => 'جديدة',
            'received' => 'مستلمة',
            'in_progress' => 'قيد المعالجة',
            'resolved' => 'تم الحل',
            'rejected' => 'مرفوضة',
            'closed' => 'مغلقة',
        ];

        $priorityLabels = [
            'high' => 'عالية',
            'medium' => 'متوسطة',
            'low' => 'منخفضة',
        ];

        return view('complaints.print', compact('complaint', 'statusLabels', 'priorityLabels'));
    }

    /**
     * FR-28: Generate PDF for complaint
     * GET /api/v1/complaints/{trackingNumber}/pdf
     */
    public function printPdf($trackingNumber)
    {
        $complaint = Complaint::where('tracking_number', $trackingNumber)
            ->with(['directorate', 'user', 'respondedBy'])
            ->first();

        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }

        $pdf = \PDF::loadView('complaints.print', compact('complaint'));

        return $pdf->download("complaint_{$trackingNumber}.pdf");
    }

    /**
     * Delete complaint by citizen (FR-22)
     * Only allowed if status is 'new' or 'received'
     * DELETE /api/v1/complaints/{id}
     */
    public function destroy(Request $request, $id)
    {
        $complaint = Complaint::findOrFail($id);

        // Check ownership
        $user = $request->user();
        if (!$user || $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // FR-22: Only allow deletion if status is 'new' or 'received'
        $allowedStatuses = ['new', 'received'];
        if (!in_array($complaint->status, $allowedStatuses)) {
            return response()->json([
                'message' => 'Cannot delete complaint. Only complaints with status "new" or "received" can be deleted.',
                'current_status' => $complaint->status
            ], 400);
        }

        // Soft delete the complaint
        $complaint->delete();

        $this->auditService->log($user, 'complaint_deleted', 'complaint', $id, [
            'tracking_number' => $complaint->tracking_number
        ]);

        return response()->json(['message' => 'Complaint deleted successfully']);
    }
}
