<?php

namespace App\Policies;

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SettingPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('settings.manage') ||
               $user->hasPermission('settings.*');
    }

    public function view(User $user, SystemSetting $setting): bool
    {
        return $user->hasPermission('settings.manage') ||
               $user->hasPermission('settings.*');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('settings.manage') ||
               $user->hasPermission('settings.*');
    }

    public function update(User $user): bool
    {
        return $user->hasPermission('settings.manage') ||
               $user->hasPermission('settings.*');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermission('settings.manage') ||
               $user->hasPermission('settings.*');
    }
}
