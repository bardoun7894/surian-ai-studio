<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    public function __construct(
        protected AuditService $auditService
    ) {}

    /**
     * FR-42: Get public settings (accessible without auth)
     */
    public function getPublicSettings(): JsonResponse
    {
        $settings = SystemSetting::getPublic();

        return response()->json([
            'settings' => $settings,
        ]);
    }

    /**
     * FR-42: Get UI settings (T-MOD-038)
     */
    public function getUiSettings(): JsonResponse
    {
        $settings = SystemSetting::where('group', 'ui')
            ->where('is_public', true)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->getTypedValue()];
            });

        return response()->json([
            'settings' => $settings,
        ]);
    }

    /**
     * Get public settings by group (e.g. contact, about)
     */
    public function getPublicSettingsByGroup(string $group): JsonResponse
    {
        $settings = SystemSetting::where('group', $group)
            ->where('is_public', true)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->getTypedValue()];
            });

        return response()->json([
            'settings' => $settings,
        ]);
    }

    /**
     * FR-42: Get all settings grouped by category (admin only)
     */
    public function index(): JsonResponse
    {
        $settings = SystemSetting::getAllGrouped();

        return response()->json([
            'settings' => $settings,
            'groups' => array_keys($settings),
        ]);
    }

    /**
     * FR-42: Get settings for a specific group (admin only)
     */
    public function getGroup(string $group): JsonResponse
    {
        $settings = SystemSetting::where('group', $group)->get();

        if ($settings->isEmpty()) {
            return response()->json([
                'message' => 'Group not found',
            ], 404);
        }

        return response()->json([
            'group' => $group,
            'settings' => $settings->map(function ($setting) {
                return [
                    'key' => $setting->key,
                    'value' => $setting->getTypedValue(),
                    'type' => $setting->type,
                    'label_ar' => $setting->label_ar,
                    'label_en' => $setting->label_en,
                    'description_ar' => $setting->description_ar,
                    'description_en' => $setting->description_en,
                    'is_public' => $setting->is_public,
                    'is_encrypted' => $setting->is_encrypted,
                ];
            }),
        ]);
    }

    /**
     * FR-42: Get a single setting value (admin only)
     */
    public function show(string $key): JsonResponse
    {
        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'message' => 'Setting not found',
            ], 404);
        }

        return response()->json([
            'key' => $setting->key,
            'value' => $setting->getTypedValue(),
            'type' => $setting->type,
            'group' => $setting->group,
            'label_ar' => $setting->label_ar,
            'label_en' => $setting->label_en,
            'description_ar' => $setting->description_ar,
            'description_en' => $setting->description_en,
            'is_public' => $setting->is_public,
        ]);
    }

    /**
     * FR-42: Update a single setting (admin only)
     */
    public function update(Request $request, string $key): JsonResponse
    {
        Gate::authorize('update', SystemSetting::class);

        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'message' => 'Setting not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'value' => 'present',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $oldValue = $setting->getTypedValue();
        $newValue = $request->input('value');

        // Validate based on type
        $validationError = $this->validateValueType($newValue, $setting->type);
        if ($validationError) {
            return response()->json([
                'message' => $validationError,
            ], 422);
        }

        SystemSetting::set($key, $newValue);

        // Audit log
        $this->auditService->log(
            'setting_update',
            'system_setting',
            $setting->id,
            [
                'key' => $key,
                'old_value' => $setting->is_encrypted ? '[encrypted]' : $oldValue,
                'new_value' => $setting->is_encrypted ? '[encrypted]' : $newValue,
            ]
        );

        return response()->json([
            'message' => 'Setting updated successfully',
            'key' => $key,
            'value' => $newValue,
        ]);
    }

    /**
     * FR-42: Bulk update settings (admin only)
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:system_settings,key',
            'settings.*.value' => 'present',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $updated = [];
        $errors = [];

        foreach ($request->input('settings') as $item) {
            $setting = SystemSetting::where('key', $item['key'])->first();

            if (!$setting) {
                $errors[] = [
                    'key' => $item['key'],
                    'error' => 'Setting not found',
                ];
                continue;
            }

            $validationError = $this->validateValueType($item['value'], $setting->type);
            if ($validationError) {
                $errors[] = [
                    'key' => $item['key'],
                    'error' => $validationError,
                ];
                continue;
            }

            $oldValue = $setting->getTypedValue();
            SystemSetting::set($item['key'], $item['value']);

            // Audit log
            $this->auditService->log(
                'setting_update',
                'system_setting',
                $setting->id,
                [
                    'key' => $item['key'],
                    'old_value' => $setting->is_encrypted ? '[encrypted]' : $oldValue,
                    'new_value' => $setting->is_encrypted ? '[encrypted]' : $item['value'],
                ]
            );

            $updated[] = $item['key'];
        }

        return response()->json([
            'message' => 'Bulk update completed',
            'updated' => $updated,
            'errors' => $errors,
        ]);
    }

    /**
     * FR-42: Create a new setting (admin only)
     */
    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', SystemSetting::class);

        $validator = Validator::make($request->all(), [
            'key' => 'required|string|unique:system_settings,key|max:255',
            'value' => 'present',
            'type' => 'required|in:string,integer,boolean,json,text',
            'group' => 'required|string|max:50',
            'label_ar' => 'nullable|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'is_public' => 'boolean',
            'is_encrypted' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validationError = $this->validateValueType($request->input('value'), $request->input('type'));
        if ($validationError) {
            return response()->json([
                'message' => $validationError,
            ], 422);
        }

        $setting = SystemSetting::create([
            'key' => $request->input('key'),
            'value' => $this->formatValueForStorage($request->input('value'), $request->input('type')),
            'type' => $request->input('type'),
            'group' => $request->input('group'),
            'label_ar' => $request->input('label_ar'),
            'label_en' => $request->input('label_en'),
            'description_ar' => $request->input('description_ar'),
            'description_en' => $request->input('description_en'),
            'is_public' => $request->boolean('is_public', false),
            'is_encrypted' => $request->boolean('is_encrypted', false),
        ]);

        // Audit log
        $this->auditService->log(
            'setting_create',
            'system_setting',
            $setting->id,
            [
                'key' => $setting->key,
                'group' => $setting->group,
            ]
        );

        return response()->json([
            'message' => 'Setting created successfully',
            'setting' => [
                'key' => $setting->key,
                'value' => $setting->getTypedValue(),
                'type' => $setting->type,
                'group' => $setting->group,
            ],
        ], 201);
    }

    /**
     * FR-42: Delete a setting (admin only)
     */
    public function destroy(string $key): JsonResponse
    {
        Gate::authorize('delete', SystemSetting::class);

        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'message' => 'Setting not found',
            ], 404);
        }

        // Audit log
        $this->auditService->log(
            'setting_delete',
            'system_setting',
            $setting->id,
            [
                'key' => $setting->key,
                'group' => $setting->group,
            ]
        );

        $setting->delete();

        // Clear cache
        SystemSetting::clearCache();

        return response()->json([
            'message' => 'Setting deleted successfully',
        ]);
    }

    /**
     * FR-42: Clear settings cache (admin only)
     */
    public function clearCache(): JsonResponse
    {
        SystemSetting::clearCache();

        return response()->json([
            'message' => 'Settings cache cleared successfully',
        ]);
    }

    /**
     * Validate value based on type
     */
    protected function validateValueType(mixed $value, string $type): ?string
    {
        return match ($type) {
            'integer' => !is_numeric($value) ? 'Value must be a number' : null,
            'boolean' => !is_bool($value) && !in_array(strtolower((string) $value), ['true', 'false', '1', '0'], true)
                ? 'Value must be a boolean'
                : null,
            'json' => (!is_array($value) && json_decode((string) $value) === null && $value !== 'null')
                ? 'Value must be valid JSON'
                : null,
            default => null,
        };
    }

    /**
     * Format value for storage
     */
    protected function formatValueForStorage(mixed $value, string $type): string
    {
        return match ($type) {
            'boolean' => $value ? 'true' : 'false',
            'json' => is_string($value) ? $value : json_encode($value),
            'integer' => (string) (int) $value,
            default => (string) $value,
        };
    }
}
