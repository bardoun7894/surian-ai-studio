<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Directorate;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class DirectorateMapController extends Controller
{
    /**
     * T082: Get all directorates with map coordinates.
     *
     * Returns active directorates that have both latitude and longitude set,
     * formatted for map display.
     *
     * GET /api/v1/public/directorates/map
     */
    public function map(): JsonResponse
    {
        $directorates = Cache::remember('directorates.map', 600, function () {
            Log::info('Directorates map cache miss, fetching from database');
            return Directorate::where('is_active', true)
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->get()
                ->map(function ($d) {
                    return [
                        'id' => (string) $d->id,
                        'name_ar' => $d->name_ar,
                        'name_en' => $d->name_en,
                        'latitude' => (float) $d->latitude,
                        'longitude' => (float) $d->longitude,
                        'address_ar' => $d->address_ar ?? '',
                        'address_en' => $d->address_en ?? '',
                        'icon' => $d->icon ?? 'Building2',
                    ];
                })
                ->values();
        });

        return response()->json($directorates);
    }

    /**
     * T082 (admin): Update directorate map location.
     *
     * PUT /api/v1/admin/directorates/{id}/location
     */
    public function updateLocation(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address_ar' => 'nullable|string|max:500',
            'address_en' => 'nullable|string|max:500',
        ]);

        $directorate = Directorate::find($id);

        if (!$directorate) {
            return response()->json(['error' => 'Directorate not found'], 404);
        }

        $oldValues = [
            'latitude' => $directorate->latitude,
            'longitude' => $directorate->longitude,
            'address_ar' => $directorate->address_ar,
            'address_en' => $directorate->address_en,
        ];

        $directorate->update([
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'address_ar' => $validated['address_ar'] ?? $directorate->address_ar,
            'address_en' => $validated['address_en'] ?? $directorate->address_en,
        ]);

        // Clear the map cache so fresh data is served
        Cache::forget('directorates.map');

        // Log the location update via AuditService
        try {
            app(AuditService::class)->log(
                $request->user(),
                'directorate.location.updated',
                'Directorate',
                null, // entity_id is int in AuditLog, directorate uses string IDs
                [
                    'directorate_id' => $id,
                    'old' => $oldValues,
                    'new' => $validated,
                ]
            );
        } catch (\Throwable $e) {
            Log::warning('Failed to create audit log for directorate location update', [
                'directorate_id' => $id,
                'error' => $e->getMessage(),
            ]);
        }

        Log::info('Directorate location updated', [
            'directorate_id' => $id,
            'user_id' => $request->user()?->id,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);

        return response()->json([
            'message' => 'Location updated successfully',
            'directorate' => [
                'id' => (string) $directorate->id,
                'name_ar' => $directorate->name_ar,
                'name_en' => $directorate->name_en,
                'latitude' => (float) $directorate->latitude,
                'longitude' => (float) $directorate->longitude,
                'address_ar' => $directorate->address_ar ?? '',
                'address_en' => $directorate->address_en ?? '',
            ],
        ]);
    }
}
