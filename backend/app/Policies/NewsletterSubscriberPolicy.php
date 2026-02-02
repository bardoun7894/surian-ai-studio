<?php

namespace App\Policies;

use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NewsletterSubscriberPolicy
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
        return $user->hasPermission('newsletter.view');
    }

    public function view(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $user->hasPermission('newsletter.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('newsletter.manage');
    }

    public function update(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $user->hasPermission('newsletter.manage');
    }

    public function delete(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $user->hasPermission('newsletter.manage');
    }

    public function export(User $user): bool
    {
        return $user->hasPermission('newsletter.view');
    }

    public function send(User $user): bool
    {
        return $user->hasPermission('newsletter.manage');
    }
}
