<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'label_ar',
        'label_en',
        'description_ar',
        'description_en',
        'is_public',
        'is_encrypted',
        'settings',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_encrypted' => 'boolean',
        'settings' => 'array',
    ];

    /**
     * Cache key prefix
     */
    protected const CACHE_PREFIX = 'settings:';
    protected const CACHE_TTL = 3600; // 1 hour

    /**
     * Get a setting value by key
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $cacheKey = self::CACHE_PREFIX . $key;

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();

            if (!$setting) {
                return $default;
            }

            return $setting->getTypedValue();
        });
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, mixed $value): bool
    {
        $setting = self::where('key', $key)->first();

        if (!$setting) {
            return false;
        }

        // Convert value based on type
        $storedValue = match ($setting->type) {
            'boolean' => $value ? 'true' : 'false',
            'json' => is_string($value) ? $value : json_encode($value),
            'integer' => (string) (int) $value,
            default => (string) $value,
        };

        // Encrypt if needed
        if ($setting->is_encrypted) {
            $storedValue = Crypt::encryptString($storedValue);
        }

        $setting->value = $storedValue;
        $setting->save();

        // Clear cache
        Cache::forget(self::CACHE_PREFIX . $key);

        return true;
    }

    /**
     * Get all settings in a group
     */
    public static function getGroup(string $group): array
    {
        $cacheKey = self::CACHE_PREFIX . 'group:' . $group;

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($group) {
            return self::where('group', $group)
                ->get()
                ->mapWithKeys(function ($setting) {
                    return [$setting->key => $setting->getTypedValue()];
                })
                ->toArray();
        });
    }

    /**
     * Get all public settings
     */
    public static function getPublic(): array
    {
        $cacheKey = self::CACHE_PREFIX . 'public';

        return Cache::remember($cacheKey, self::CACHE_TTL, function () {
            return self::where('is_public', true)
                ->get()
                ->mapWithKeys(function ($setting) {
                    return [$setting->key => $setting->getTypedValue()];
                })
                ->toArray();
        });
    }

    /**
     * Get all settings grouped by group
     */
    public static function getAllGrouped(): array
    {
        return self::all()
            ->groupBy('group')
            ->map(function ($settings) {
                return $settings->map(function ($setting) {
                    return [
                        'key' => $setting->key,
                        'value' => $setting->getTypedValue(),
                        'type' => $setting->type,
                        'label_ar' => $setting->label_ar,
                        'label_en' => $setting->label_en,
                        'description_ar' => $setting->description_ar,
                        'description_en' => $setting->description_en,
                        'is_public' => $setting->is_public,
                    ];
                });
            })
            ->toArray();
    }

    /**
     * Clear all settings cache
     */
    public static function clearCache(): void
    {
        // Clear individual setting caches
        self::all()->each(function ($setting) {
            Cache::forget(self::CACHE_PREFIX . $setting->key);
        });

        // Clear group caches
        $groups = self::distinct()->pluck('group');
        foreach ($groups as $group) {
            Cache::forget(self::CACHE_PREFIX . 'group:' . $group);
        }

        // Clear public cache
        Cache::forget(self::CACHE_PREFIX . 'public');
    }

    /**
     * Get the typed value based on the setting type
     */
    public function getTypedValue(): mixed
    {
        $value = $this->value;

        // Decrypt if needed
        if ($this->is_encrypted && $value) {
            try {
                $value = Crypt::decryptString($value);
            } catch (\Exception $e) {
                return null;
            }
        }

        return match ($this->type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }

    /**
     * Scope for public settings
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for a specific group
     */
    public function scopeInGroup($query, string $group)
    {
        return $query->where('group', $group);
    }
}
