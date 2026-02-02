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
        if (in_array('*', $user->role?->permissions ?? [])) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('services.view');
    }

    public function view(User $user, Service $service): bool
    {
        if (!$user->hasPermission('services.view')) {
            return false;
        }

        // Directorate-scoped users can only view their directorate's services
        if ($user->directorate_id && $service->directorate_id) {
            return $service->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('services.manage');
    }

    public function update(User $user, Service $service): bool
    {
        if (!$user->hasPermission('services.manage')) {
            return false;
        }

        if ($user->directorate_id && $service->directorate_id) {
            return $service->directorate_id === $user->directorate_id;
        }

        return true;
    }

    public function delete(User $user, Service $service): bool
    {
        if (!$user->hasPermission('services.manage')) {
            return false;
        }

        // Only ministry-level users can delete
        return !$user->directorate_id;
    }
}
