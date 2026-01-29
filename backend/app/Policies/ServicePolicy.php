<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServicePolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('services.view') ||
               $user->hasPermission('services.*');
    }

    public function view(User $user, Service $service): bool
    {
        if ($user->hasPermission('services.view') || $user->hasPermission('services.*')) {
            // Directorate-scoped users can only view their directorate's services
            if ($user->directorate_id && $service->directorate_id) {
                return $service->directorate_id === $user->directorate_id;
            }
            return true;
        }
        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('services.manage') ||
               $user->hasPermission('services.*');
    }

    public function update(User $user, Service $service): bool
    {
        if (!$user->hasPermission('services.manage') && !$user->hasPermission('services.*')) {
            return false;
        }

        if ($user->directorate_id && $service->directorate_id) {
            return $service->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function delete(User $user, Service $service): bool
    {
        if (!$user->hasPermission('services.manage') && !$user->hasPermission('services.*')) {
            return false;
        }

        // Only ministry-level users can delete
        return !$user->directorate_id;
    }
}
