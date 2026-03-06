<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GovernmentPartner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GovernmentPartnerController extends Controller
{
    /**
     * Public: Get all active partners
     */
    public function index(): JsonResponse
    {
        $partners = Cache::remember('public.government_partners', 600, function () {
            return GovernmentPartner::active()
                ->ordered()
                ->get()
                ->map(fn($p) => $this->formatPartner($p));
        });

        return response()->json([
            'success' => true,
            'data' => $partners,
        ]);
    }

    /**
     * Admin: List all partners (including inactive)
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = GovernmentPartner::ordered();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $partners = $query->get()->map(fn($p) => $this->formatPartner($p, true));

        return response()->json([
            'success' => true,
            'data' => $partners,
            'total' => $partners->count(),
        ]);
    }

    /**
     * Admin: Create partner
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'url' => 'nullable|url|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('partners', 'public');
        }

        $partner = GovernmentPartner::create($data);
        Cache::forget('public.government_partners');

        return response()->json([
            'success' => true,
            'data' => $this->formatPartner($partner, true),
            'message' => 'Partner created successfully',
        ], 201);
    }

    /**
     * Admin: Show single partner
     */
    public function show(int $id): JsonResponse
    {
        $partner = GovernmentPartner::find($id);

        if (!$partner) {
            return response()->json(['success' => false, 'message' => 'Partner not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatPartner($partner, true),
        ]);
    }

    /**
     * Admin: Update partner
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $partner = GovernmentPartner::find($id);

        if (!$partner) {
            return response()->json(['success' => false, 'message' => 'Partner not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name_ar' => 'sometimes|required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'url' => 'nullable|url|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($partner->logo && !str_starts_with($partner->logo, 'http')) {
                Storage::disk('public')->delete($partner->logo);
            }
            $data['logo'] = $request->file('logo')->store('partners', 'public');
        }

        $partner->update($data);
        Cache::forget('public.government_partners');

        return response()->json([
            'success' => true,
            'data' => $this->formatPartner($partner->fresh(), true),
            'message' => 'Partner updated successfully',
        ]);
    }

    /**
     * Admin: Delete partner
     */
    public function destroy(int $id): JsonResponse
    {
        $partner = GovernmentPartner::find($id);

        if (!$partner) {
            return response()->json(['success' => false, 'message' => 'Partner not found'], 404);
        }

        // Delete logo file
        if ($partner->logo && !str_starts_with($partner->logo, 'http')) {
            Storage::disk('public')->delete($partner->logo);
        }

        $partner->delete();
        Cache::forget('public.government_partners');

        return response()->json([
            'success' => true,
            'message' => 'Partner deleted successfully',
        ]);
    }

    /**
     * Admin: Toggle active status
     */
    public function toggleActive(int $id): JsonResponse
    {
        $partner = GovernmentPartner::find($id);

        if (!$partner) {
            return response()->json(['success' => false, 'message' => 'Partner not found'], 404);
        }

        $partner->update(['is_active' => !$partner->is_active]);
        Cache::forget('public.government_partners');

        return response()->json([
            'success' => true,
            'is_active' => $partner->is_active,
            'message' => $partner->is_active ? 'Partner activated' : 'Partner deactivated',
        ]);
    }

    /**
     * Admin: Reorder partners
     */
    public function reorder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'order' => 'required|array',
            'order.*.id' => 'required|integer|exists:government_partners,id',
            'order.*.sort_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        foreach ($request->order as $item) {
            GovernmentPartner::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('public.government_partners');

        return response()->json([
            'success' => true,
            'message' => 'Partners reordered successfully',
        ]);
    }

    /**
     * Format partner for API response
     */
    private function formatPartner(GovernmentPartner $partner, bool $admin = false): array
    {
        $data = [
            'id' => $partner->id,
            'name_ar' => $partner->name_ar,
            'name_en' => $partner->name_en,
            'logo' => $partner->logo_url,
            'url' => $partner->url,
            'sort_order' => $partner->sort_order,
            'is_active' => $partner->is_active,
        ];

        if ($admin) {
            $data['created_at'] = $partner->created_at?->toISOString();
            $data['updated_at'] = $partner->updated_at?->toISOString();
        }

        return $data;
    }
}
