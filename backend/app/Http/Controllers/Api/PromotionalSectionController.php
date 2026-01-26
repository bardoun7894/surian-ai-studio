<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromotionalSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
