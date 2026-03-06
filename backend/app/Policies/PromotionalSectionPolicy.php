<?php

namespace App\Policies;

use App\Models\PromotionalSection;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PromotionalSectionPolicy
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
        return $user->hasPermission('promotional.view');
    }

    public function view(User $user, PromotionalSection $section): bool
    {
        return $user->hasPermission('promotional.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('promotional.manage');
    }

    public function update(User $user, PromotionalSection $section): bool
    {
        return $user->hasPermission('promotional.manage');
    }

    public function delete(User $user, PromotionalSection $section): bool
    {
        return $user->hasPermission('promotional.manage');
    }

    public function toggleActive(User $user, PromotionalSection $section): bool
    {
        return $this->update($user, $section);
    }

    public function reorder(User $user): bool
    {
        return $user->hasPermission('promotional.manage');
    }
}
