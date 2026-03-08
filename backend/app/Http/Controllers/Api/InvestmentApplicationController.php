<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestmentApplication;
use App\Models\InvestmentApplicationAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\RateLimiter;

class InvestmentApplicationController extends Controller
{
    /**
     * Submit a new investment application (public)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'investment_id' => 'nullable|exists:investments,id',
            'full_name' => 'required|string|max:255',
            'national_id' => 'required|string|size:11|regex:/^\d{11}$/',
            'company_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'proposed_amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:5000',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
        ], [
            'national_id.required' => 'الرقم الوطني مطلوب',
            'national_id.size' => 'الرقم الوطني يجب أن يتكون من 11 رقماً بالضبط',
            'national_id.regex' => 'الرقم الوطني يجب أن يحتوي على أرقام فقط',
            'full_name.required' => 'الاسم الكامل مطلوب',
            'company_name.required' => 'اسم الشركة مطلوب',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'phone.required' => 'رقم الهاتف مطلوب',
            'proposed_amount.required' => 'مبلغ الاستثمار المقترح مطلوب',
        ]);

        // Rate limit: 3 applications per day per national_id
        $key = "investment_app_{$request->national_id}";
        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json([
                'success' => false,
                'message' => 'لقد تجاوزت الحد المسموح من الطلبات اليومية (3 طلبات)',
            ], 429);
        }
        RateLimiter::hit($key, 86400);

        $application = InvestmentApplication::create([
            'investment_id' => $request->investment_id,
            'full_name' => strip_tags($request->full_name),
            'national_id' => $request->national_id,
            'company_name' => strip_tags($request->company_name),
            'email' => $request->email,
            'phone' => $request->phone,
            'proposed_amount' => $request->proposed_amount,
            'description' => $request->description ? strip_tags($request->description) : null,
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('investment-applications/' . $application->id, 'public');
                InvestmentApplicationAttachment::create([
                    'investment_application_id' => $application->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        Log::info('Investment application submitted', [
            'tracking_number' => $application->tracking_number,
            'investment_id' => $application->investment_id,
        ]);

        return response()->json([
            'success' => true,
            'tracking_number' => $application->tracking_number,
            'message' => 'تم تقديم طلبك بنجاح',
        ], 201);
    }

    /**
     * Track an investment application by tracking number (public)
     */
    public function track(string $trackingNumber, Request $request): JsonResponse
    {
        $application = InvestmentApplication::where('tracking_number', $trackingNumber)
            ->with(['investment:id,title_ar,title_en,sector_ar,sector_en', 'attachments'])
            ->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على الطلب',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'tracking_number' => $application->tracking_number,
                'full_name' => $application->full_name,
                'company_name' => $application->company_name,
                'status' => $application->status,
                'status_label' => $application->status_label,
                'investment' => $application->investment ? [
                    'title_ar' => $application->investment->title_ar,
                    'title_en' => $application->investment->title_en,
                ] : null,
                'proposed_amount' => $application->proposed_amount,
                'staff_notes' => $application->staff_notes,
                'created_at' => $application->created_at->toISOString(),
                'updated_at' => $application->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * List all investment applications (staff)
     */
    public function listAll(Request $request): JsonResponse
    {
        $query = InvestmentApplication::with(['investment:id,title_ar,title_en'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('national_id', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $results = $query->paginate($perPage);

        return response()->json([
            'data' => $results->items(),
            'total' => $results->total(),
            'current_page' => $results->currentPage(),
            'last_page' => $results->lastPage(),
            'per_page' => $results->perPage(),
        ]);
    }

    /**
     * Update application status (staff)
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:received,under_review,needs_more_info,approved,rejected',
            'staff_notes' => 'nullable|string|max:5000',
        ]);

        $application = InvestmentApplication::findOrFail($id);
        $application->update([
            'status' => $request->status,
            'staff_notes' => $request->staff_notes ?? $application->staff_notes,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Get a single application detail (staff)
     */
    public function show(int $id): JsonResponse
    {
        $application = InvestmentApplication::with(['investment', 'attachments'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $application,
        ]);
    }
}
