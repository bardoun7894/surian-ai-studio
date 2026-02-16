<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CivilRegistryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NationalIdController extends Controller
{
    public function __construct(
        private CivilRegistryService $civilRegistryService
    ) {}

    /**
     * Verify national ID against civil registry
     * POST /api/v1/public/verify-national-id
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'national_id' => 'required|string|size:11|regex:/^\d{11}$/',
            'first_name' => 'nullable|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ], [
            'national_id.required' => 'الرقم الوطني مطلوب',
            'national_id.size' => 'الرقم الوطني يجب أن يتكون من 11 رقماً بالضبط',
            'national_id.regex' => 'الرقم الوطني يجب أن يحتوي على أرقام فقط',
        ]);

        $personalData = array_filter([
            'first_name' => $request->input('first_name'),
            'father_name' => $request->input('father_name'),
            'last_name' => $request->input('last_name'),
            'birth_date' => $request->input('birth_date'),
        ]);

        $result = $this->civilRegistryService->verifyIdentity(
            $request->input('national_id'),
            $personalData
        );

        // Don't expose full citizen data to unauthenticated users
        $responseData = [
            'verified' => $result['verified'],
            'message' => $result['message'],
            'service_available' => $result['service_available'],
        ];

        // Only return citizen data fields that help auto-fill
        if ($result['verified'] && $result['citizen_data']) {
            $responseData['citizen_data'] = [
                'first_name' => $result['citizen_data']['first_name'] ?? null,
                'father_name' => $result['citizen_data']['father_name'] ?? null,
                'last_name' => $result['citizen_data']['last_name'] ?? null,
                'birth_date' => $result['citizen_data']['birth_date'] ?? null,
                'governorate' => $result['citizen_data']['governorate'] ?? null,
            ];
        }

        // Return mismatched fields info
        if (!empty($result['mismatched_fields'])) {
            $responseData['mismatched_fields'] = $result['mismatched_fields'];
        }

        return response()->json($responseData, $result['verified'] ? 200 : 422);
    }

    /**
     * Quick format validation only (no API call)
     * POST /api/v1/public/validate-national-id
     */
    public function validateFormat(Request $request): JsonResponse
    {
        $nationalId = $request->input('national_id', '');
        
        $errors = [];
        
        if (empty($nationalId)) {
            $errors[] = 'الرقم الوطني مطلوب';
        } elseif (strlen($nationalId) !== 11) {
            $errors[] = 'الرقم الوطني يجب أن يتكون من 11 رقماً بالضبط. الرقم المدخل يحتوي على ' . strlen($nationalId) . ' أرقام';
        } elseif (!preg_match('/^\d+$/', $nationalId)) {
            $errors[] = 'الرقم الوطني يجب أن يحتوي على أرقام فقط بدون أحرف أو رموز';
        }

        if (!empty($errors)) {
            return response()->json([
                'valid' => false,
                'errors' => $errors,
                'message' => $errors[0],
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'message' => 'صيغة الرقم الوطني صالحة',
            'service_available' => $this->civilRegistryService->isEnabled(),
        ]);
    }
}
