<?php

namespace App\Policies;

use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SuggestionPolicy
{
    use HandlesAuthorization;

    /**
     * Super admin bypass - grants all permissions.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
        return null; // Fall through to normal checks
    }

    /**
     * Determine whether the user can view any suggestions.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('suggestions.view') ||
               $user->hasPermission('suggestions.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can view the suggestion.
     */
    public function view(User $user, Suggestion $suggestion): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('suggestions.view') && !$user->hasPermission('suggestions.*')) {
            return false;
        }

        // If user has directorate, they can only view suggestions for their directorate
        if ($user->directorate_id && $suggestion->directorate_id) {
            return $suggestion->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can create suggestions.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('suggestions.create') ||
               $user->hasPermission('suggestions.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can update the suggestion.
     */
    public function update(User $user, Suggestion $suggestion): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('suggestions.update') && !$user->hasPermission('suggestions.*')) {
            return false;
        }

        // Directorate-scoped users can only update their directorate's suggestions
        if ($user->directorate_id && $suggestion->directorate_id) {
            return $suggestion->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the suggestion.
     */
    public function delete(User $user, Suggestion $suggestion): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('suggestions.delete') && !$user->hasPermission('suggestions.*')) {
            return false;
        }

        // Only super admin and ministry-level users can delete
        return !$user->directorate_id;
    }

    /**
     * Determine whether the user can respond to the suggestion.
     */
    public function respond(User $user, Suggestion $suggestion): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('suggestions.respond') && !$user->hasPermission('suggestions.*')) {
            return false;
        }

        // Directorate-scoped users can only respond to their directorate's suggestions
        if ($user->directorate_id && $suggestion->directorate_id) {
            return $suggestion->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can change status of the suggestion.
     */
    public function changeStatus(User $user, Suggestion $suggestion): bool
    {
        return $this->update($user, $suggestion);
    }
}
