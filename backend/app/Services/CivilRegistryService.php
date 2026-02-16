<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CivilRegistryService
{
    private string $baseUrl;
    private string $apiKey;
    private string $apiSecret;
    private int $timeout;
    private int $retryAttempts;
    private int $cacheTtl;
    private bool $enabled;
    private bool $verifySsl;

    public function __construct()
    {
        $config = config('external.civil_registry');
        $this->enabled = $config['enabled'] ?? false;
        $this->baseUrl = $config['base_url'] ?? '';
        $this->apiKey = $config['api_key'] ?? '';
        $this->apiSecret = $config['api_secret'] ?? '';
        $this->timeout = $config['timeout'] ?? 15;
        $this->retryAttempts = $config['retry_attempts'] ?? 3;
        $this->cacheTtl = $config['cache_ttl'] ?? 3600;
        $this->verifySsl = $config['verify_ssl'] ?? true;
    }

    /**
     * Check if service is enabled and configured
     */
    public function isEnabled(): bool
    {
        return $this->enabled && !empty($this->baseUrl) && !empty($this->apiKey);
    }

    /**
     * Verify a national ID against the civil registry
     * Returns citizen data if valid, null if not found
     * 
     * @param string $nationalId 11-digit national ID
     * @return array|null Citizen data or null
     */
    public function verifyCitizen(string $nationalId): ?array
    {
        if (!$this->isEnabled()) {
            Log::info('CivilRegistry: Service disabled, skipping verification', ['national_id' => substr($nationalId, 0, 4) . '***']);
            return null;
        }

        // Check cache first
        $cacheKey = "civil_registry:citizen:{$nationalId}";
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            Log::debug('CivilRegistry: Cache hit', ['national_id' => substr($nationalId, 0, 4) . '***']);
            return $cached;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'X-API-Secret' => $this->apiSecret,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->timeout($this->timeout)
            ->retry($this->retryAttempts, 1000)
            ->withOptions(['verify' => $this->verifySsl])
            ->post("{$this->baseUrl}/citizens/verify", [
                'national_id' => $nationalId,
            ]);

            if ($response->successful()) {
                $data = $response->json('data');
                
                if ($data) {
                    // Normalize response
                    $citizenData = [
                        'national_id' => $data['national_id'] ?? $nationalId,
                        'first_name' => $data['first_name'] ?? $data['first_name_ar'] ?? '',
                        'father_name' => $data['father_name'] ?? $data['father_name_ar'] ?? '',
                        'last_name' => $data['last_name'] ?? $data['last_name_ar'] ?? '',
                        'full_name' => $data['full_name'] ?? '',
                        'birth_date' => $data['birth_date'] ?? $data['date_of_birth'] ?? null,
                        'gender' => $data['gender'] ?? null,
                        'governorate' => $data['governorate'] ?? $data['registration_place'] ?? null,
                        'mother_name' => $data['mother_name'] ?? null,
                        'is_alive' => $data['is_alive'] ?? true,
                        'verified' => true,
                    ];

                    // Cache successful result
                    Cache::put($cacheKey, $citizenData, $this->cacheTtl);
                    
                    Log::info('CivilRegistry: Citizen verified', [
                        'national_id' => substr($nationalId, 0, 4) . '***',
                        'verified' => true,
                    ]);

                    return $citizenData;
                }
            }

            if ($response->status() === 404) {
                Log::warning('CivilRegistry: Citizen not found', [
                    'national_id' => substr($nationalId, 0, 4) . '***',
                ]);
                // Cache negative result for shorter time
                Cache::put($cacheKey, false, 300);
                return null;
            }

            Log::error('CivilRegistry: API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('CivilRegistry: Connection failed', [
                'error' => $e->getMessage(),
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('CivilRegistry: Unexpected error', [
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Verify national ID matches provided personal data
     * 
     * @param string $nationalId
     * @param array $personalData ['first_name', 'father_name', 'last_name', 'birth_date']
     * @return array ['verified' => bool, 'citizen_data' => array|null, 'mismatched_fields' => array]
     */
    public function verifyIdentity(string $nationalId, array $personalData = []): array
    {
        $result = [
            'verified' => false,
            'citizen_data' => null,
            'mismatched_fields' => [],
            'service_available' => $this->isEnabled(),
        ];

        if (!$this->isEnabled()) {
            // When service is disabled, only validate format
            $result['verified'] = (bool) preg_match('/^\d{11}$/', $nationalId);
            $result['message'] = $result['verified'] 
                ? 'تم التحقق من صيغة الرقم الوطني' 
                : 'صيغة الرقم الوطني غير صالحة. يجب أن يتكون من 11 رقماً';
            return $result;
        }

        $citizenData = $this->verifyCitizen($nationalId);
        
        if (!$citizenData) {
            $result['message'] = 'الرقم الوطني غير مسجل في السجل المدني. يرجى التحقق من صحة الرقم المدخل.';
            return $result;
        }

        $result['citizen_data'] = $citizenData;
        $result['verified'] = true;

        // Compare provided data with civil registry data
        if (!empty($personalData)) {
            $fieldsToCompare = [
                'first_name' => 'الاسم الأول',
                'father_name' => 'اسم الأب',
                'last_name' => 'الكنية',
                'birth_date' => 'تاريخ الميلاد',
            ];

            foreach ($fieldsToCompare as $field => $label) {
                if (!empty($personalData[$field]) && !empty($citizenData[$field])) {
                    $provided = mb_strtolower(trim($personalData[$field]));
                    $registered = mb_strtolower(trim($citizenData[$field]));
                    
                    if ($field === 'birth_date') {
                        $provided = date('Y-m-d', strtotime($personalData[$field]));
                        $registered = date('Y-m-d', strtotime($citizenData[$field]));
                    }

                    if ($provided !== $registered) {
                        $result['mismatched_fields'][] = [
                            'field' => $field,
                            'label' => $label,
                        ];
                    }
                }
            }

            if (!empty($result['mismatched_fields'])) {
                $result['verified'] = false;
                $fieldLabels = array_map(fn($f) => $f['label'], $result['mismatched_fields']);
                $result['message'] = 'البيانات المدخلة غير مطابقة للسجل المدني في الحقول التالية: ' . implode('، ', $fieldLabels) . '. يرجى التحقق من البيانات وتصحيحها.';
            } else {
                $result['message'] = 'تم التحقق من البيانات بنجاح ومطابقتها مع السجل المدني.';
            }
        } else {
            $result['message'] = 'تم التحقق من الرقم الوطني بنجاح في السجل المدني.';
        }

        return $result;
    }

    /**
     * Clear cached citizen data
     */
    public function clearCache(string $nationalId): void
    {
        Cache::forget("civil_registry:citizen:{$nationalId}");
    }
}
