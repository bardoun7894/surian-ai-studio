<?php

namespace App\Policies;

use App\Models\PromotionalSection;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PromotionalSectionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any promotional sections.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('promotional.view') ||
               $user->hasPermission('promotional.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can view the promotional section.
     */
    public function view(User $user, PromotionalSection $section): bool
    {
        return $user->hasPermission('promotional.view') ||
               $user->hasPermission('promotional.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can create promotional sections.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('promotional.create') ||
               $user->hasPermission('promotional.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can update the promotional section.
     */
    public function update(User $user, PromotionalSection $section): bool
    {
        return $user->hasPermission('promotional.update') ||
               $user->hasPermission('promotional.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can delete the promotional section.
     */
    public function delete(User $user, PromotionalSection $section): bool
    {
        return $user->hasPermission('promotional.delete') ||
               $user->hasPermission('promotional.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can toggle active status.
     */
    public function toggleActive(User $user, PromotionalSection $section): bool
    {
        return $this->update($user, $section);
    }

    /**
     * Determine whether the user can reorder promotional sections.
     */
    public function reorder(User $user): bool
    {
        return $user->hasPermission('promotional.update') ||
               $user->hasPermission('promotional.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }
}
