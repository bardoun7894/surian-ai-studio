<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\ContentVersion;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentVersionController extends Controller
{
    protected AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    /**
     * FR-14: List all versions of a content item
     * GET /api/v1/admin/content/{contentId}/versions
     */
    public function index(Request $request, string $contentId): JsonResponse
    {
        $content = Content::findOrFail($contentId);

        $versions = $content->versions()
            ->with('editor:id,name')
            ->paginate($request->get('per_page', 20));

        $versionsData = $versions->map(function ($version) {
            return [
                'id' => $version->id,
                'version_number' => $version->version_number,
                'editor' => [
                    'id' => $version->editor?->id,
                    'name' => $version->editor?->name ?? 'System',
                ],
                'created_at' => $version->created_at->toIso8601String(),
                'changes' => $version->getChanges(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $versionsData,
            'meta' => [
                'current_page' => $versions->currentPage(),
                'per_page' => $versions->perPage(),
                'total' => $versions->total(),
                'last_page' => $versions->lastPage(),
            ]
        ]);
    }

    /**
     * FR-14: Get a specific version
     * GET /api/v1/admin/content/{contentId}/versions/{versionNumber}
     */
    public function show(string $contentId, int $versionNumber): JsonResponse
    {
        $content = Content::findOrFail($contentId);
        $version = $content->getVersion($versionNumber);

        if (!$version) {
            return response()->json([
                'success' => false,
                'message' => 'Version not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $version->id,
                'version_number' => $version->version_number,
                'snapshot' => $version->snapshot,
                'editor' => [
                    'id' => $version->editor?->id,
                    'name' => $version->editor?->name ?? 'System',
                ],
                'created_at' => $version->created_at->toIso8601String(),
                'changes' => $version->getChanges(),
            ]
        ]);
    }

    /**
     * FR-14: Restore content to a specific version
     * POST /api/v1/admin/content/{contentId}/versions/{versionNumber}/restore
     */
    public function restore(string $contentId, int $versionNumber): JsonResponse
    {
        $content = Content::findOrFail($contentId);
        $version = $content->getVersion($versionNumber);

        if (!$version) {
            return response()->json([
                'success' => false,
                'message' => 'Version not found',
            ], 404);
        }

        // Restore the version
        $restoredContent = $version->restore();

        // Log the action
        $this->auditService->log(
            auth()->user(),
            'content_version_restored',
            'content',
            $content->id,
            [
                'version_number' => $versionNumber,
                'title' => $content->title_ar ?? $content->title_en,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Content restored to version ' . $versionNumber,
            'data' => $restoredContent->load('versions.editor:id,name'),
        ]);
    }

    /**
     * FR-14: Compare two versions or a version with current
     * GET /api/v1/admin/content/{contentId}/versions/{versionNumber}/compare?with={otherVersionNumber}
     */
    public function compare(Request $request, string $contentId, int $versionNumber): JsonResponse
    {
        $content = Content::findOrFail($contentId);
        $version = $content->getVersion($versionNumber);

        if (!$version) {
            return response()->json([
                'success' => false,
                'message' => 'Version not found',
            ], 404);
        }

        // Get the version to compare with
        $compareWith = $request->get('with');

        if ($compareWith === 'current' || !$compareWith) {
            // Compare with current content state
            $currentSnapshot = $content->only([
                'title_ar',
                'title_en',
                'content_ar',
                'content_en',
                'slug',
                'category',
                'status',
                'featured',
                'published_at',
                'metadata',
                'seo_title_ar',
                'seo_title_en',
                'seo_description_ar',
                'seo_description_en',
                'tags',
                'priority',
            ]);
            $compareSnapshot = $currentSnapshot;
            $compareLabel = 'Current Version';
        } else {
            // Compare with another version
            $otherVersion = $content->getVersion((int) $compareWith);

            if (!$otherVersion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Comparison version not found',
                ], 404);
            }

            $compareSnapshot = $otherVersion->snapshot;
            $compareLabel = 'Version ' . $compareWith;
        }

        // Calculate differences
        $differences = [];
        $versionSnapshot = $version->snapshot;

        foreach ($versionSnapshot as $key => $value) {
            $compareValue = $compareSnapshot[$key] ?? null;

            if ($value !== $compareValue) {
                $differences[$key] = [
                    'field' => $key,
                    'version_' . $versionNumber => $value,
                    'compared_to' => $compareValue,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'version_number' => $versionNumber,
                'compared_with' => $compareWith ?? 'current',
                'compared_with_label' => $compareLabel,
                'differences' => $differences,
                'has_differences' => !empty($differences),
            ]
        ]);
    }
}
