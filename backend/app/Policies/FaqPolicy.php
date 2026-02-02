<?php

namespace App\Policies;

use App\Models\Faq;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FaqPolicy
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
        return $user->hasPermission('faq.view');
    }

    public function view(User $user, Faq $faq): bool
    {
        return $user->hasPermission('faq.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('faq.manage');
    }

    public function update(User $user, Faq $faq): bool
    {
        return $user->hasPermission('faq.manage');
    }

    public function delete(User $user, Faq $faq): bool
    {
        return $user->hasPermission('faq.manage');
    }
}
