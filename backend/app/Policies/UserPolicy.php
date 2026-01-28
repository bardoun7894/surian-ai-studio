<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Super admin bypass - grants all permissions.
     * Note: Some actions like delete self are still restricted in their specific methods.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
        return null; // Fall through to normal checks
    }

    /**
     * Determine whether the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('users.view') ||
               $user->hasPermission('users.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Users can always view themselves
        if ($user->id === $model->id) {
            return true;
        }

        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('users.view') && !$user->hasPermission('users.*')) {
            return false;
        }

        // Directorate admins can only view users in their directorate
        if ($user->directorate_id) {
            return $model->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can create users.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('users.create') ||
               $user->hasPermission('users.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Users can update their own profile (limited fields)
        if ($user->id === $model->id) {
            return true;
        }

        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('users.update') && !$user->hasPermission('users.*')) {
            return false;
        }

        // Cannot update super admins unless you are super admin
        if ($model->hasRole('super_admin')) {
            return false;
        }

        // Directorate admins can only update users in their directorate
        if ($user->directorate_id) {
            return $model->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Cannot delete yourself
        if ($user->id === $model->id) {
            return false;
        }

        // Only super admins can delete users
        if (!$user->hasRole('super_admin')) {
            return false;
        }

        // Cannot delete other super admins
        if ($model->hasRole('super_admin')) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can change role of the model.
     */
    public function changeRole(User $user, User $model): bool
    {
        // Cannot change your own role
        if ($user->id === $model->id) {
            return false;
        }

        // Only super admins can change roles
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can toggle active status of the model.
     */
    public function toggleActive(User $user, User $model): bool
    {
        // Cannot deactivate yourself
        if ($user->id === $model->id) {
            return false;
        }

        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('users.update') && !$user->hasPermission('users.*')) {
            return false;
        }

        // Cannot toggle super admin status
        if ($model->hasRole('super_admin')) {
            return false;
        }

        return true;
    }
}
