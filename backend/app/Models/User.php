<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $appends = ['full_name'];

    protected $fillable = [
        'first_name',
        'father_name',
        'last_name',
        'email',
        'password',
        'role_id',
        'directorate_id',
        'national_id',
        'phone',
        'birth_date',
        'governorate',
        'is_active',
        'two_factor_enabled',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'otp',
        'otp_expires_at',
        'notification_preferences',
        'password_reset_token',
        'password_reset_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp',
        'otp_expires_at',
        'password_reset_token',
        'password_reset_expires_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'birth_date' => 'date',
            'otp_expires_at' => 'datetime',
            'notification_preferences' => 'array',
            'password_reset_expires_at' => 'datetime',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->father_name} {$this->last_name}");
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function directorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    public function suggestions(): HasMany
    {
        return $this->hasMany(Suggestion::class);
    }

    public function hasPermission(string $permission): bool
    {
        if (!$this->role) {
            return false;
        }

        $permissions = $this->role->permissions ?? [];

        // Guard against corrupted data (e.g. double-encoded JSON strings)
        if (!is_array($permissions)) {
            $decoded = is_string($permissions) ? json_decode($permissions, true) : null;
            $permissions = is_array($decoded) ? $decoded : [];
        }

        if (in_array('*', $permissions)) {
            return true;
        }

        // Support wildcard in the requested permission
        // e.g. hasPermission('admin.*') matches user with 'admin.panel'
        if (str_ends_with($permission, '.*')) {
            $requiredPrefix = substr($permission, 0, -2);
            foreach ($permissions as $p) {
                if (str_starts_with($p, $requiredPrefix . '.') || $p === $permission) {
                    return true;
                }
            }
            return false;
        }

        foreach ($permissions as $p) {
            if (str_ends_with($p, '.*')) {
                $prefix = substr($p, 0, -2);
                if (str_starts_with($permission, $prefix . '.')) {
                    return true;
                }
            }
            if ($p === $permission) {
                return true;
            }
        }

        return false;
    }

    public function hasRole(string $roleName): bool
    {
        return $this->role?->name === $roleName;
    }
}
