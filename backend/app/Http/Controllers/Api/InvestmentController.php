<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestmentController extends Controller
{
    /**
     * Get all investments with optional filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Investment::active()->orderBy('order')->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        $investments = $query->get()->map(fn($inv) => $this->formatInvestment($inv));

        return response()->json([
            'success' => true,
            'data' => $investments,
            'count' => $investments->count(),
        ]);
    }

    /**
     * Get investments by category (opportunities, one-stop, licenses, guide)
     */
    public function byCategory(string $category): JsonResponse
    {
        $validCategories = ['opportunities', 'one-stop', 'licenses', 'guide'];

        if (!in_array($category, $validCategories)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid category',
            ], 400);
        }

        $investments = Investment::active()
            ->byCategory($category)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($inv) => $this->formatInvestment($inv));

        return response()->json([
            'success' => true,
            'data' => $investments,
            'count' => $investments->count(),
            'category' => $category,
        ]);
    }

    /**
     * Get a single investment
     */
    public function show(int $id): JsonResponse
    {
        $investment = Investment::active()->find($id);

        if (!$investment) {
            return response()->json([
                'success' => false,
                'message' => 'Investment not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatInvestment($investment, true),
        ]);
    }

    /**
     * Get investment statistics
     */
    public function stats(): JsonResponse
    {
        $totalOpportunities = Investment::active()->byCategory('opportunities')->count();
        $totalAvailable = Investment::active()->byStatus('available')->count();
        $totalAmount = Investment::active()->byCategory('opportunities')->sum('investment_amount');
        $sectors = Investment::active()->byCategory('opportunities')
            ->select('sector_ar', 'sector_en')
            ->distinct()
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_opportunities' => $totalOpportunities,
                'available_count' => $totalAvailable,
                'total_investment_value' => $totalAmount,
                'sectors_count' => $sectors,
                'labels' => [
                    'total_opportunities' => [
                        'ar' => 'فرصة استثمارية',
                        'en' => 'Investment Opportunities',
                    ],
                    'available_count' => [
                        'ar' => 'فرصة متاحة',
                        'en' => 'Available Opportunities',
                    ],
                    'total_investment_value' => [
                        'ar' => 'حجم الاستثمارات',
                        'en' => 'Investment Volume',
                    ],
                    'sectors_count' => [
                        'ar' => 'قطاع اقتصادي',
                        'en' => 'Economic Sectors',
                    ],
                ],
            ],
        ]);
    }

    /**
     * Format investment for API response
     */
    private function formatInvestment(Investment $investment, bool $detailed = false): array
    {
        $data = [
            'id' => $investment->id,
            'title_ar' => $investment->title_ar,
            'title_en' => $investment->title_en,
            'sector_ar' => $investment->sector_ar,
            'sector_en' => $investment->sector_en,
            'location_ar' => $investment->location_ar,
            'location_en' => $investment->location_en,
            'investment_amount' => $investment->investment_amount,
            'formatted_amount' => $investment->formatted_amount,
            'currency' => $investment->currency,
            'status' => $investment->status,
            'status_label' => $investment->status_label,
            'category' => $investment->category,
            'icon' => $investment->icon,
            'image' => $investment->image ? asset('storage/' . $investment->image) : null,
            'is_featured' => $investment->is_featured,
        ];

        if ($detailed) {
            $data = array_merge($data, [
                'description_ar' => $investment->description_ar,
                'description_en' => $investment->description_en,
                'requirements' => $investment->requirements,
                'fee' => $investment->fee,
                'processing_time' => $investment->processing_time,
                'contact_email' => $investment->contact_email,
                'contact_phone' => $investment->contact_phone,
                'created_at' => $investment->created_at?->toISOString(),
                'updated_at' => $investment->updated_at?->toISOString(),
            ]);
        }

        return $data;
    }
}
