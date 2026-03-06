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
        if (in_array('*', $user->role?->permissions ?? [])) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('settings.manage');
    }

    public function view(User $user, SystemSetting $setting): bool
    {
        return $user->hasPermission('settings.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('settings.manage');
    }

    public function update(User $user): bool
    {
        return $user->hasPermission('settings.manage');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermission('settings.manage');
    }
}
