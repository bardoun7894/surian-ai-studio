<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PromotionalSectionResource;
use App\Models\PromotionalSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PromotionalSectionController extends Controller
{
    /**
     * Get all promotional sections with optional filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = PromotionalSection::published()->ordered();

        // Filter by position
        if ($request->has('position')) {
            $query->position($request->position);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->ofType($request->type);
        }

        // Limit results
        if ($request->has('limit')) {
            $query->limit((int) $request->limit);
        }

        $sections = $query->get()->map(fn($section) => $this->formatSection($section));

        return response()->json([
            'success' => true,
            'data' => $sections,
            'count' => $sections->count(),
        ]);
    }

    /**
     * Get promotional sections by position
     */
    public function byPosition(string $position): JsonResponse
    {
        $validPositions = ['hero', 'grid_main', 'grid_side', 'grid_bottom'];

        if (!in_array($position, $validPositions)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid position',
            ], 400);
        }

        $sections = PromotionalSection::published()
            ->position($position)
            ->ordered()
            ->get()
            ->map(fn($section) => $this->formatSection($section));

        return response()->json([
            'success' => true,
            'data' => $sections,
            'count' => $sections->count(),
            'position' => $position,
        ]);
    }

    /**
     * Get a single promotional section
     */
    public function show(int $id): JsonResponse
    {
        $section = PromotionalSection::published()->find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Promotional section not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatSection($section, true),
        ]);
    }

    /**
     * Format promotional section for API response
     */
    private function formatSection(PromotionalSection $section, bool $detailed = false): array
    {
        $data = [
            'id' => $section->id,
            'title_ar' => $section->title_ar,
            'title_en' => $section->title_en,
            'description_ar' => $section->description_ar,
            'description_en' => $section->description_en,
            'button_text_ar' => $section->button_text_ar,
            'button_text_en' => $section->button_text_en,
            'image' => $section->image_url,
            'background_color' => $section->background_color,
            'icon' => $section->icon,
            'button_url' => $section->button_url,
            'type' => $section->type,
            'type_label' => $section->type_label,
            'position' => $section->position,
            'position_label' => $section->position_label,
            'display_order' => $section->display_order,
        ];

        if ($detailed) {
            $data = array_merge($data, [
                'metadata' => $section->metadata,
                'published_at' => $section->published_at?->toISOString(),
                'expires_at' => $section->expires_at?->toISOString(),
                'created_at' => $section->created_at?->toISOString(),
                'updated_at' => $section->updated_at?->toISOString(),
            ]);
        }

        return $data;
    }

    // ==================== ADMIN METHODS ====================

    /**
     * List all promotional sections (admin - includes inactive)
     * GET /api/v1/admin/promotional-sections
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = PromotionalSection::query();

        // Filter by position
        if ($request->has('position') && $request->position) {
            $query->where('position', $request->position);
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%")
                  ->orWhere('description_ar', 'like', "%{$search}%")
                  ->orWhere('description_en', 'like', "%{$search}%");
            });
        }

        // Sort
        $query->orderBy('display_order', 'asc')
              ->orderBy('created_at', 'desc');

        // Paginate
        $perPage = min((int) $request->get('per_page', 15), 100);
        $sections = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => PromotionalSectionResource::collection($sections->items()),
            'meta' => [
                'current_page' => $sections->currentPage(),
                'last_page' => $sections->lastPage(),
                'per_page' => $sections->perPage(),
                'total' => $sections->total(),
            ],
        ]);
    }

    /**
     * Get stats for promotional sections (admin)
     * GET /api/v1/admin/promotional-sections/stats
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total' => PromotionalSection::count(),
                'active' => PromotionalSection::where('is_active', true)->count(),
                'inactive' => PromotionalSection::where('is_active', false)->count(),
                'by_position' => [
                    'hero' => PromotionalSection::where('position', 'hero')->count(),
                    'grid_main' => PromotionalSection::where('position', 'grid_main')->count(),
                    'grid_side' => PromotionalSection::where('position', 'grid_side')->count(),
                    'grid_bottom' => PromotionalSection::where('position', 'grid_bottom')->count(),
                ],
                'by_type' => [
                    'banner' => PromotionalSection::where('type', 'banner')->count(),
                    'video' => PromotionalSection::where('type', 'video')->count(),
                    'promo' => PromotionalSection::where('type', 'promo')->count(),
                    'stat' => PromotionalSection::where('type', 'stat')->count(),
                ],
            ],
        ]);
    }

    /**
     * Get a single promotional section for admin
     * GET /api/v1/admin/promotional-sections/{id}
     */
    public function adminShow(int $id): JsonResponse
    {
        $section = PromotionalSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'القسم الترويجي غير موجود',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new PromotionalSectionResource($section),
        ]);
    }

    /**
     * Create a promotional section (admin)
     * POST /api/v1/admin/promotional-sections
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', PromotionalSection::class);

        $validator = Validator::make($request->all(), [
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'button_text_ar' => 'nullable|string|max:100',
            'button_text_en' => 'nullable|string|max:100',
            'button_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_url' => 'nullable|string|max:500',
            'background_color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:100',
            'type' => 'required|in:banner,video,promo,stat',
            'position' => 'required|in:hero,grid_main,grid_side,grid_bottom',
            'display_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
            'metadata' => 'nullable|array',
        ], [
            'title_ar.required' => 'العنوان بالعربية مطلوب',
            'type.required' => 'نوع القسم مطلوب',
            'type.in' => 'نوع القسم غير صالح',
            'position.required' => 'موقع القسم مطلوب',
            'position.in' => 'موقع القسم غير صالح',
            'image.image' => 'الملف يجب أن يكون صورة',
            'image.max' => 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صالحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('image');

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('promotional', 'public');
            $data['image'] = $path;
        }

        // Set default display order if not provided
        if (!isset($data['display_order'])) {
            $maxOrder = PromotionalSection::where('position', $request->position)->max('display_order');
            $data['display_order'] = ($maxOrder ?? 0) + 1;
        }

        $section = PromotionalSection::create($data);

        Log::info("Promotional section created", ['id' => $section->id, 'title' => $section->title_ar]);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء القسم الترويجي بنجاح',
            'data' => new PromotionalSectionResource($section),
        ], 201);
    }

    /**
     * Update a promotional section (admin)
     * PUT /api/v1/admin/promotional-sections/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $section = PromotionalSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'القسم الترويجي غير موجود',
            ], 404);
        }

        $this->authorize('update', $section);

        $validator = Validator::make($request->all(), [
            'title_ar' => 'sometimes|required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'button_text_ar' => 'nullable|string|max:100',
            'button_text_en' => 'nullable|string|max:100',
            'button_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_url' => 'nullable|string|max:500',
            'background_color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:100',
            'type' => 'sometimes|in:banner,video,promo,stat',
            'position' => 'sometimes|in:hero,grid_main,grid_side,grid_bottom',
            'display_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صالحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('image');

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($section->image) {
                Storage::disk('public')->delete($section->image);
            }
            $path = $request->file('image')->store('promotional', 'public');
            $data['image'] = $path;
        }

        $section->update($data);

        Log::info("Promotional section updated", ['id' => $section->id]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث القسم الترويجي بنجاح',
            'data' => new PromotionalSectionResource($section->fresh()),
        ]);
    }

    /**
     * Delete a promotional section (admin)
     * DELETE /api/v1/admin/promotional-sections/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $section = PromotionalSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'القسم الترويجي غير موجود',
            ], 404);
        }

        $this->authorize('delete', $section);

        // Delete associated image
        if ($section->image) {
            Storage::disk('public')->delete($section->image);
        }

        $section->delete();

        Log::info("Promotional section deleted", ['id' => $id]);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف القسم الترويجي بنجاح',
        ]);
    }

    /**
     * Toggle active status (admin)
     * PATCH /api/v1/admin/promotional-sections/{id}/toggle-active
     */
    public function toggleActive(int $id): JsonResponse
    {
        $section = PromotionalSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'القسم الترويجي غير موجود',
            ], 404);
        }

        $section->is_active = !$section->is_active;
        $section->save();

        $status = $section->is_active ? 'مفعّل' : 'معطّل';

        Log::info("Promotional section toggled", ['id' => $id, 'is_active' => $section->is_active]);

        return response()->json([
            'success' => true,
            'message' => "تم تغيير حالة القسم إلى: {$status}",
            'data' => new PromotionalSectionResource($section),
        ]);
    }

    /**
     * Reorder promotional sections (admin)
     * POST /api/v1/admin/promotional-sections/reorder
     */
    public function reorder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:promotional_sections,id',
            'items.*.display_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صالحة',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->items as $item) {
            PromotionalSection::where('id', $item['id'])
                ->update(['display_order' => $item['display_order']]);
        }

        Log::info("Promotional sections reordered", ['count' => count($request->items)]);

        return response()->json([
            'success' => true,
            'message' => 'تم إعادة ترتيب الأقسام بنجاح',
        ]);
    }
}
