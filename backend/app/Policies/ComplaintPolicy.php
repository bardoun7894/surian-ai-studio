<?php

namespace App\Policies;

use App\Models\Complaint;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ComplaintPolicy
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
     * Determine whether the user can view any complaints.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('complaints.view') ||
               $user->hasPermission('complaints.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can view the complaint.
     */
    public function view(User $user, Complaint $complaint): bool
    {
        // Super admin can view all
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Check basic permission
        if (!$user->hasPermission('complaints.view') && !$user->hasPermission('complaints.*')) {
            return false;
        }

        // If user has directorate, they can only view complaints for their directorate
        if ($user->directorate_id) {
            return $complaint->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can create complaints.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('complaints.create') ||
               $user->hasPermission('complaints.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can update the complaint.
     */
    public function update(User $user, Complaint $complaint): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('complaints.update') && !$user->hasPermission('complaints.*')) {
            return false;
        }

        // Directorate-scoped users can only update their directorate's complaints
        if ($user->directorate_id) {
            return $complaint->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the complaint.
     */
    public function delete(User $user, Complaint $complaint): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('complaints.delete') && !$user->hasPermission('complaints.*')) {
            return false;
        }

        // Only super admin and ministry-level users can delete
        return !$user->directorate_id;
    }

    /**
     * Determine whether the user can respond to the complaint.
     */
    public function respond(User $user, Complaint $complaint): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if (!$user->hasPermission('complaints.respond') && !$user->hasPermission('complaints.*')) {
            return false;
        }

        // Directorate-scoped users can only respond to their directorate's complaints
        if ($user->directorate_id) {
            return $complaint->directorate_id === $user->directorate_id;
        }

        return true;
    }

    /**
     * Determine whether the user can change status of the complaint.
     */
    public function changeStatus(User $user, Complaint $complaint): bool
    {
        return $this->update($user, $complaint);
    }

    /**
     * Determine whether the user can assign the complaint.
     */
    public function assign(User $user, Complaint $complaint): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasPermission('complaints.assign') || $user->hasPermission('complaints.*');
    }
}
