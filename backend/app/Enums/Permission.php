<?php

namespace App\Enums;

class Permission
{
    // Admin
    public const ADMIN_PANEL = 'admin.panel';
    public const ADMIN_ALL = 'admin.*';

    // Content
    public const CONTENT_VIEW = 'content.view';
    public const CONTENT_CREATE = 'content.create';
    public const CONTENT_EDIT = 'content.edit';
    public const CONTENT_DELETE = 'content.delete';
    public const CONTENT_PUBLISH = 'content.publish';
    public const CONTENT_FEATURE = 'content.feature';
    public const CONTENT_ALL = 'content.*';

    // Complaints
    public const COMPLAINTS_VIEW = 'complaints.view';
    public const COMPLAINTS_CREATE = 'complaints.create';
    public const COMPLAINTS_UPDATE = 'complaints.update';
    public const COMPLAINTS_DELETE = 'complaints.delete';
    public const COMPLAINTS_MANAGE = 'complaints.manage';
    public const COMPLAINTS_ASSIGN = 'complaints.assign';
    public const COMPLAINTS_RESPOND = 'complaints.respond';
    public const COMPLAINTS_ALL = 'complaints.*';

    // Suggestions
    public const SUGGESTIONS_VIEW = 'suggestions.view';
    public const SUGGESTIONS_MANAGE = 'suggestions.manage';
    public const SUGGESTIONS_RESPOND = 'suggestions.respond';
    public const SUGGESTIONS_ALL = 'suggestions.*';

    // Users
    public const USERS_VIEW = 'users.view';
    public const USERS_CREATE = 'users.create';
    public const USERS_EDIT = 'users.edit';
    public const USERS_DELETE = 'users.delete';
    public const USERS_ALL = 'users.*';

    // Services
    public const SERVICES_VIEW = 'services.view';
    public const SERVICES_MANAGE = 'services.manage';
    public const SERVICES_ALL = 'services.*';

    // Directorates
    public const DIRECTORATES_VIEW = 'directorates.view';
    public const DIRECTORATES_MANAGE = 'directorates.manage';
    public const DIRECTORATES_ALL = 'directorates.*';

    // Settings
    public const SETTINGS_MANAGE = 'settings.manage';
    public const SETTINGS_ALL = 'settings.*';

    // Reports
    public const REPORTS_VIEW = 'reports.view';
    public const REPORTS_ALL = 'reports.*';

    // Backups
    public const BACKUPS_MANAGE = 'backups.manage';
    public const BACKUPS_ALL = 'backups.*';

    // Audit
    public const AUDIT_VIEW = 'audit.view';
    public const AUDIT_ALL = 'audit.*';

    // Newsletter
    public const NEWSLETTER_VIEW = 'newsletter.view';
    public const NEWSLETTER_MANAGE = 'newsletter.manage';
    public const NEWSLETTER_ALL = 'newsletter.*';

    // Promotional
    public const PROMOTIONAL_VIEW = 'promotional.view';
    public const PROMOTIONAL_MANAGE = 'promotional.manage';
    public const PROMOTIONAL_ALL = 'promotional.*';

    // FAQ
    public const FAQ_VIEW = 'faq.view';
    public const FAQ_MANAGE = 'faq.manage';
    public const FAQ_ALL = 'faq.*';

    // Super admin wildcard
    public const SUPER_ADMIN = '*';
}
