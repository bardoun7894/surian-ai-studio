<?php

namespace App\Policies;

use App\Models\Complaint;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ComplaintPolicy
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
        return $user->hasPermission('complaints.view');
    }

    public function view(User $user, Complaint $complaint): bool
    {
        if (!$user->hasPermission('complaints.view')) {
            return false;
        }

        // If user has directorate, they can only view complaints for their directorate
        if ($user->directorate_id) {
            return $complaint->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('complaints.create');
    }

    public function update(User $user, Complaint $complaint): bool
    {
        if (!$user->hasPermission('complaints.update')) {
            return false;
        }

        // Directorate-scoped users can only update their directorate's complaints
        if ($user->directorate_id) {
            return $complaint->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function delete(User $user, Complaint $complaint): bool
    {
        if (!$user->hasPermission('complaints.delete')) {
            return false;
        }

        // Only ministry-level users can delete
        return !$user->directorate_id;
    }

    public function respond(User $user, Complaint $complaint): bool
    {
        if (!$user->hasPermission('complaints.respond')) {
            return false;
        }

        // Directorate-scoped users can only respond to their directorate's complaints
        if ($user->directorate_id) {
            return $complaint->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function changeStatus(User $user, Complaint $complaint): bool
    {
        return $this->update($user, $complaint);
    }

    public function assign(User $user, Complaint $complaint): bool
    {
        return $user->hasPermission('complaints.assign');
    }
}
