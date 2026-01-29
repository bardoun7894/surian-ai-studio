<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Role;
use App\Models\Directorate;
use App\Models\Complaint;
use App\Models\Suggestion;
use App\Models\Content;
use App\Models\NewsletterSubscriber;
use App\Models\PromotionalSection;
use App\Models\SystemSetting;
use App\Models\Faq;
use App\Models\Service;
use App\Policies\ComplaintPolicy;
use App\Policies\SuggestionPolicy;
use App\Policies\ContentPolicy;
use App\Policies\UserPolicy;
use App\Policies\NewsletterSubscriberPolicy;
use App\Policies\PromotionalSectionPolicy;
use App\Policies\SettingPolicy;
use App\Policies\FaqPolicy;
use App\Policies\ServicePolicy;
use App\Observers\AuditObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Complaint::class => ComplaintPolicy::class,
        Suggestion::class => SuggestionPolicy::class,
        Content::class => ContentPolicy::class,
        User::class => UserPolicy::class,
        NewsletterSubscriber::class => NewsletterSubscriberPolicy::class,
        PromotionalSection::class => PromotionalSectionPolicy::class,
        SystemSetting::class => SettingPolicy::class,
        Faq::class => FaqPolicy::class,
        Service::class => ServicePolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }

        // Register observers
        User::observe(AuditObserver::class);
        Role::observe(AuditObserver::class);
        Directorate::observe(AuditObserver::class);
        // Add other models as needed
    }
}
