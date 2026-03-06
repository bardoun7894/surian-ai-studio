<?php

namespace App\Policies;

use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SuggestionPolicy
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
        return $user->hasPermission('suggestions.view');
    }

    public function view(User $user, Suggestion $suggestion): bool
    {
        if (!$user->hasPermission('suggestions.view')) {
            return false;
        }

        // If user has directorate, they can only view suggestions for their directorate
        if ($user->directorate_id && $suggestion->directorate_id) {
            return $suggestion->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('suggestions.manage');
    }

    public function update(User $user, Suggestion $suggestion): bool
    {
        if (!$user->hasPermission('suggestions.manage')) {
            return false;
        }

        // Directorate-scoped users can only update their directorate's suggestions
        if ($user->directorate_id && $suggestion->directorate_id) {
            return $suggestion->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function delete(User $user, Suggestion $suggestion): bool
    {
        if (!$user->hasPermission('suggestions.manage')) {
            return false;
        }

        // Only ministry-level users can delete
        return !$user->directorate_id;
    }

    public function respond(User $user, Suggestion $suggestion): bool
    {
        if (!$user->hasPermission('suggestions.respond')) {
            return false;
        }

        // Directorate-scoped users can only respond to their directorate's suggestions
        if ($user->directorate_id && $suggestion->directorate_id) {
            return $suggestion->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function changeStatus(User $user, Suggestion $suggestion): bool
    {
        return $this->update($user, $suggestion);
    }
}
