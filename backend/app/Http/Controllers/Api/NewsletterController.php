<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    /**
     * Subscribe to the newsletter
     * POST /api/v1/public/newsletter/subscribe
     */
    public function subscribe(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني غير صالح',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = strtolower(trim($request->email));

        // Check if already subscribed
        $existing = NewsletterSubscriber::where('email', $email)->first();

        if ($existing) {
            if ($existing->isActive()) {
                return response()->json([
                    'success' => true,
                    'message' => 'أنت مشترك بالفعل في النشرة البريدية',
                ]);
            }

            // Re-subscribe if previously unsubscribed
            $existing->subscribe();

            return response()->json([
                'success' => true,
                'message' => 'تم إعادة الاشتراك في النشرة البريدية بنجاح',
            ]);
        }

        // Create new subscription
        $subscriber = NewsletterSubscriber::create([
            'email' => $email,
            'status' => 'active',
            'subscribed_at' => now(),
            'unsubscribe_token' => NewsletterSubscriber::generateUnsubscribeToken(),
        ]);

        Log::info("New newsletter subscription: {$email}");

        return response()->json([
            'success' => true,
            'message' => 'تم الاشتراك في النشرة البريدية بنجاح',
        ]);
    }

    /**
     * Unsubscribe from the newsletter
     * POST /api/v1/public/newsletter/unsubscribe
     */
    public function unsubscribe(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'رمز غير صالح',
                'errors' => $validator->errors()
            ], 422);
        }

        $subscriber = NewsletterSubscriber::where('unsubscribe_token', $request->token)->first();

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'رابط إلغاء الاشتراك غير صالح',
            ], 404);
        }

        if (!$subscriber->isActive()) {
            return response()->json([
                'success' => true,
                'message' => 'تم إلغاء اشتراكك بالفعل',
            ]);
        }

        $subscriber->unsubscribe();

        Log::info("Newsletter unsubscription: {$subscriber->email}");

        return response()->json([
            'success' => true,
            'message' => 'تم إلغاء اشتراكك في النشرة البريدية بنجاح',
        ]);
    }

    /**
     * Get subscriber count (admin endpoint)
     * GET /api/v1/admin/newsletter/stats
     */
    public function stats(): JsonResponse
    {
        $totalActive = NewsletterSubscriber::active()->count();
        $totalUnsubscribed = NewsletterSubscriber::where('status', 'unsubscribed')->count();
        $thisMonth = NewsletterSubscriber::active()
            ->whereMonth('subscribed_at', now()->month)
            ->whereYear('subscribed_at', now()->year)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'active_subscribers' => $totalActive,
                'unsubscribed' => $totalUnsubscribed,
                'total' => $totalActive + $totalUnsubscribed,
                'this_month' => $thisMonth,
            ],
        ]);
    }

    /**
     * List all subscribers with pagination (admin)
     * GET /api/v1/admin/newsletter/subscribers
     */
    public function index(Request $request): JsonResponse
    {
        $query = NewsletterSubscriber::query();

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['active', 'unsubscribed'])) {
            $query->where('status', $request->status);
        }

        // Search by email
        if ($request->has('search') && $request->search) {
            $query->where('email', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sortBy = $request->get('sort_by', 'subscribed_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Paginate
        $perPage = min((int) $request->get('per_page', 15), 100);
        $subscribers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $subscribers->items(),
            'meta' => [
                'current_page' => $subscribers->currentPage(),
                'last_page' => $subscribers->lastPage(),
                'per_page' => $subscribers->perPage(),
                'total' => $subscribers->total(),
            ],
        ]);
    }

    /**
     * Delete a subscriber (admin)
     * DELETE /api/v1/admin/newsletter/subscribers/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::find($id);

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'المشترك غير موجود',
            ], 404);
        }

        $email = $subscriber->email;
        $subscriber->delete();

        Log::info("Newsletter subscriber deleted by admin: {$email}");

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المشترك بنجاح',
        ]);
    }

    /**
     * Export subscribers to CSV (admin)
     * GET /api/v1/admin/newsletter/export
     */
    public function export(Request $request)
    {
        $query = NewsletterSubscriber::query();

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['active', 'unsubscribed'])) {
            $query->where('status', $request->status);
        }

        $subscribers = $query->orderBy('subscribed_at', 'desc')->get();

        $csv = "Email,Status,Subscribed At,Unsubscribed At\n";

        foreach ($subscribers as $subscriber) {
            $csv .= sprintf(
                "%s,%s,%s,%s\n",
                $subscriber->email,
                $subscriber->status,
                $subscriber->subscribed_at?->format('Y-m-d H:i:s') ?? '',
                $subscriber->unsubscribed_at?->format('Y-m-d H:i:s') ?? ''
            );
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="newsletter_subscribers_' . date('Y-m-d') . '.csv"',
        ]);
    }

    /**
     * Send newsletter to all active subscribers (admin)
     * POST /api/v1/admin/newsletter/send
     */
    public function send(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'html_content' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صالحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $service = app(\App\Services\NewsletterService::class);
        $result = $service->sendNewsletter(
            $request->subject,
            $request->content,
            $request->html_content
        );

        Log::info("Newsletter sent", $result);

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال النشرة البريدية',
            'data' => $result,
        ]);
    }
}
