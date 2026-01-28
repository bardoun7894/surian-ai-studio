<?php

namespace App\Policies;

use App\Models\Content;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContentPolicy
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
     * Determine whether the user can view any content.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('content.view') ||
               $user->hasPermission('content.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can view the content.
     */
    public function view(User $user, Content $content): bool
    {
        if ($user->hasRole('super_admin') || $user->hasRole('content_manager')) {
            return true;
        }

        if (!$user->hasPermission('content.view') && !$user->hasPermission('content.*')) {
            return false;
        }

        // If content is associated with a directorate, check user's directorate
        if ($content->directorate_id && $user->directorate_id) {
            return $content->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can create content.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('content.create') ||
               $user->hasPermission('content.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can update the content.
     */
    public function update(User $user, Content $content): bool
    {
        if ($user->hasRole('super_admin') || $user->hasRole('content_manager')) {
            return true;
        }

        if (!$user->hasPermission('content.update') && !$user->hasPermission('content.*')) {
            return false;
        }

        // Authors can update their own content
        if ($content->author_id === $user->id) {
            return true;
        }

        // Directorate-scoped users can only update their directorate's content
        if ($content->directorate_id && $user->directorate_id) {
            return $content->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the content.
     */
    public function delete(User $user, Content $content): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('content.delete') && !$user->hasPermission('content.*')) {
            return false;
        }

        // Content managers can delete
        if ($user->hasRole('content_manager')) {
            return true;
        }

        // Authors can delete their own unpublished content
        if ($content->author_id === $user->id && !$content->is_published) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can publish the content.
     */
    public function publish(User $user, Content $content): bool
    {
        if ($user->hasRole('super_admin') || $user->hasRole('content_manager')) {
            return true;
        }

        return $user->hasPermission('content.publish') || $user->hasPermission('content.*');
    }

    /**
     * Determine whether the user can feature the content.
     */
    public function feature(User $user, Content $content): bool
    {
        if ($user->hasRole('super_admin') || $user->hasRole('content_manager')) {
            return true;
        }

        return $user->hasPermission('content.feature') || $user->hasPermission('content.*');
    }
}
