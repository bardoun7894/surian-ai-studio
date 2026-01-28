<?php

namespace App\Policies;

use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NewsletterSubscriberPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any newsletter subscribers.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('newsletter.view') ||
               $user->hasPermission('newsletter.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can view the newsletter subscriber.
     */
    public function view(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $user->hasPermission('newsletter.view') ||
               $user->hasPermission('newsletter.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can create newsletter subscribers.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('newsletter.create') ||
               $user->hasPermission('newsletter.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can update the newsletter subscriber.
     */
    public function update(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $user->hasPermission('newsletter.update') ||
               $user->hasPermission('newsletter.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can delete the newsletter subscriber.
     */
    public function delete(User $user, NewsletterSubscriber $subscriber): bool
    {
        return $user->hasPermission('newsletter.delete') ||
               $user->hasPermission('newsletter.*') ||
               $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can export newsletter subscribers.
     */
    public function export(User $user): bool
    {
        return $user->hasPermission('newsletter.export') ||
               $user->hasPermission('newsletter.*') ||
               $user->hasRole('super_admin') ||
               $user->hasRole('content_manager');
    }

    /**
     * Determine whether the user can send newsletters.
     */
    public function send(User $user): bool
    {
        return $user->hasPermission('newsletter.send') ||
               $user->hasPermission('newsletter.*') ||
               $user->hasRole('super_admin');
    }
}
