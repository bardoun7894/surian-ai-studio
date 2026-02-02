<?php

namespace App\Policies;

use App\Models\Content;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContentPolicy
{
    use HandlesAuthorization;

    /**
     * Super admin bypass - grants all permissions via wildcard in hasPermission().
     */
    public function before(User $user, string $ability): bool|null
    {
        if (in_array('*', $user->role?->permissions ?? [])) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('content.view');
    }

    public function view(User $user, Content $content): bool
    {
        if (!$user->hasPermission('content.view')) {
            return false;
        }

        // If content is associated with a directorate, check user's directorate
        if ($content->directorate_id && $user->directorate_id) {
            return $content->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('content.create');
    }

    public function update(User $user, Content $content): bool
    {
        if (!$user->hasPermission('content.edit')) {
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

    public function delete(User $user, Content $content): bool
    {
        if (!$user->hasPermission('content.delete')) {
            return false;
        }

        // Authors can delete their own unpublished content
        if ($content->author_id === $user->id && !$content->is_published) {
            return true;
        }

        // Users with full content access can delete
        if ($user->hasPermission('content.*')) {
            return true;
        }

        return false;
    }

    public function publish(User $user, Content $content): bool
    {
        return $user->hasPermission('content.publish');
    }

    public function feature(User $user, Content $content): bool
    {
        return $user->hasPermission('content.feature');
    }
}
