<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Super admin bypass - grants all permissions via wildcard in hasPermission().
     * Note: Some actions like delete self are still restricted in their specific methods.
     */
    public function before(User $user, string $ability): bool|null
    {
        if (in_array('*', $user->role?->permissions ?? [])) {
            // Still fall through for self-protection checks
            if (in_array($ability, ['delete', 'changeRole', 'toggleActive'])) {
                return null;
            }
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('users.view');
    }

    public function view(User $user, User $model): bool
    {
        // Users can always view themselves
        if ($user->id === $model->id) {
            return true;
        }

        if (!$user->hasPermission('users.view')) {
            return false;
        }

        // Directorate admins can only view users in their directorate
        if ($user->directorate_id) {
            return $model->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('users.create');
    }

    public function update(User $user, User $model): bool
    {
        // Users can update their own profile (limited fields)
        if ($user->id === $model->id) {
            return true;
        }

        if (!$user->hasPermission('users.edit')) {
            return false;
        }

        // Cannot update super admins unless you are super admin
        if (in_array('*', $model->role?->permissions ?? [])) {
            return in_array('*', $user->role?->permissions ?? []);
        }

        // Directorate admins can only update users in their directorate
        if ($user->directorate_id) {
            return $model->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function delete(User $user, User $model): bool
    {
        // Cannot delete yourself
        if ($user->id === $model->id) {
            return false;
        }

        if (!$user->hasPermission('users.delete')) {
            return false;
        }

        // Cannot delete super admins
        if (in_array('*', $model->role?->permissions ?? [])) {
            return false;
        }

        return true;
    }

    public function changeRole(User $user, User $model): bool
    {
        // Cannot change your own role
        if ($user->id === $model->id) {
            return false;
        }

        // Only users with wildcard or roles permissions can change roles
        return $user->hasPermission('roles.edit');
    }

    public function toggleActive(User $user, User $model): bool
    {
        // Cannot deactivate yourself
        if ($user->id === $model->id) {
            return false;
        }

        if (!$user->hasPermission('users.edit')) {
            return false;
        }

        // Cannot toggle super admin status
        if (in_array('*', $model->role?->permissions ?? [])) {
            return false;
        }

        return true;
    }
}
