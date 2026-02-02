<?php

namespace App\Enums;

class Permission
{
    // Admin
    public const ADMIN_PANEL = 'admin.panel';
    public const ADMIN_ALL = 'admin.*';

    // Content (general)
    public const CONTENT_VIEW = 'content.view';
    public const CONTENT_CREATE = 'content.create';
    public const CONTENT_EDIT = 'content.edit';
    public const CONTENT_DELETE = 'content.delete';
    public const CONTENT_PUBLISH = 'content.publish';
    public const CONTENT_FEATURE = 'content.feature';
    public const CONTENT_ALL = 'content.*';

    // Content types (per-category access)
    public const CONTENT_NEWS = 'content.type.news';
    public const CONTENT_ANNOUNCEMENT = 'content.type.announcement';
    public const CONTENT_DECREE = 'content.type.decree';
    public const CONTENT_SERVICE = 'content.type.service';
    public const CONTENT_FAQ = 'content.type.faq';
    public const CONTENT_ABOUT = 'content.type.about';
    public const CONTENT_MEDIA = 'content.type.media';
    public const CONTENT_PAGE = 'content.type.page';

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

    // Investments
    public const INVESTMENTS_VIEW = 'investments.view';
    public const INVESTMENTS_MANAGE = 'investments.manage';
    public const INVESTMENTS_ALL = 'investments.*';

    // Quick Links
    public const QUICK_LINKS_VIEW = 'quick_links.view';
    public const QUICK_LINKS_MANAGE = 'quick_links.manage';
    public const QUICK_LINKS_ALL = 'quick_links.*';

    // Chat
    public const CHAT_VIEW = 'chat.view';
    public const CHAT_MANAGE = 'chat.manage';
    public const CHAT_ALL = 'chat.*';

    // Notifications
    public const NOTIFICATIONS_VIEW = 'notifications.view';
    public const NOTIFICATIONS_MANAGE = 'notifications.manage';
    public const NOTIFICATIONS_ALL = 'notifications.*';

    // Complaint Templates
    public const COMPLAINT_TEMPLATES_VIEW = 'complaint_templates.view';
    public const COMPLAINT_TEMPLATES_MANAGE = 'complaint_templates.manage';
    public const COMPLAINT_TEMPLATES_ALL = 'complaint_templates.*';

    // Sub-Directorates
    public const SUB_DIRECTORATES_VIEW = 'sub_directorates.view';
    public const SUB_DIRECTORATES_MANAGE = 'sub_directorates.manage';
    public const SUB_DIRECTORATES_ALL = 'sub_directorates.*';

    // Roles
    public const ROLES_VIEW = 'roles.view';
    public const ROLES_CREATE = 'roles.create';
    public const ROLES_EDIT = 'roles.edit';
    public const ROLES_DELETE = 'roles.delete';
    public const ROLES_ALL = 'roles.*';

    // Super admin wildcard
    public const SUPER_ADMIN = '*';

    /**
     * Returns all permissions grouped by category with Arabic labels.
     * Used by RoleResource form to build dynamic grouped checkboxes.
     */
    public static function grouped(): array
    {
        return [
            'admin' => [
                'label' => 'لوحة الإدارة',
                'permissions' => [
                    self::ADMIN_PANEL => 'الوصول إلى لوحة الإدارة',
                ],
            ],
            'users' => [
                'label' => 'المستخدمون',
                'permissions' => [
                    self::USERS_VIEW => 'عرض المستخدمين',
                    self::USERS_CREATE => 'إنشاء مستخدمين',
                    self::USERS_EDIT => 'تعديل المستخدمين',
                    self::USERS_DELETE => 'حذف المستخدمين',
                ],
            ],
            'roles' => [
                'label' => 'الأدوار والصلاحيات',
                'permissions' => [
                    self::ROLES_VIEW => 'عرض الأدوار',
                    self::ROLES_CREATE => 'إنشاء أدوار',
                    self::ROLES_EDIT => 'تعديل الأدوار',
                    self::ROLES_DELETE => 'حذف الأدوار',
                ],
            ],
            'content' => [
                'label' => 'المحتوى — الصلاحيات',
                'permissions' => [
                    self::CONTENT_VIEW => 'عرض المحتوى',
                    self::CONTENT_CREATE => 'إنشاء محتوى',
                    self::CONTENT_EDIT => 'تعديل المحتوى',
                    self::CONTENT_DELETE => 'حذف المحتوى',
                    self::CONTENT_PUBLISH => 'نشر المحتوى',
                    self::CONTENT_FEATURE => 'تمييز المحتوى',
                ],
            ],
            'content_types' => [
                'label' => 'المحتوى — أنواع المحتوى المسموحة',
                'permissions' => [
                    self::CONTENT_NEWS => 'الأخبار',
                    self::CONTENT_ANNOUNCEMENT => 'الإعلانات',
                    self::CONTENT_DECREE => 'القرارات والمراسيم',
                    self::CONTENT_SERVICE => 'الخدمات',
                    self::CONTENT_FAQ => 'الأسئلة الشائعة',
                    self::CONTENT_ABOUT => 'حول الوزارة',
                    self::CONTENT_MEDIA => 'الوسائط',
                    self::CONTENT_PAGE => 'الصفحات الثابتة',
                ],
            ],
            'complaints' => [
                'label' => 'الشكاوى',
                'permissions' => [
                    self::COMPLAINTS_VIEW => 'عرض الشكاوى',
                    self::COMPLAINTS_CREATE => 'إنشاء الشكاوى',
                    self::COMPLAINTS_UPDATE => 'تحديث الشكاوى',
                    self::COMPLAINTS_DELETE => 'حذف الشكاوى',
                    self::COMPLAINTS_MANAGE => 'إدارة الشكاوى',
                    self::COMPLAINTS_ASSIGN => 'تعيين الشكاوى',
                    self::COMPLAINTS_RESPOND => 'الرد على الشكاوى',
                ],
            ],
            'complaint_templates' => [
                'label' => 'قوالب الشكاوى',
                'permissions' => [
                    self::COMPLAINT_TEMPLATES_VIEW => 'عرض القوالب',
                    self::COMPLAINT_TEMPLATES_MANAGE => 'إدارة القوالب',
                ],
            ],
            'suggestions' => [
                'label' => 'المقترحات',
                'permissions' => [
                    self::SUGGESTIONS_VIEW => 'عرض المقترحات',
                    self::SUGGESTIONS_MANAGE => 'إدارة المقترحات',
                    self::SUGGESTIONS_RESPOND => 'الرد على المقترحات',
                ],
            ],
            'services' => [
                'label' => 'الخدمات',
                'permissions' => [
                    self::SERVICES_VIEW => 'عرض الخدمات',
                    self::SERVICES_MANAGE => 'إدارة الخدمات',
                ],
            ],
            'directorates' => [
                'label' => 'الإدارات',
                'permissions' => [
                    self::DIRECTORATES_VIEW => 'عرض الإدارات',
                    self::DIRECTORATES_MANAGE => 'إدارة الإدارات',
                ],
            ],
            'sub_directorates' => [
                'label' => 'الإدارات الفرعية',
                'permissions' => [
                    self::SUB_DIRECTORATES_VIEW => 'عرض الإدارات الفرعية',
                    self::SUB_DIRECTORATES_MANAGE => 'إدارة الإدارات الفرعية',
                ],
            ],
            'investments' => [
                'label' => 'الاستثمارات',
                'permissions' => [
                    self::INVESTMENTS_VIEW => 'عرض الاستثمارات',
                    self::INVESTMENTS_MANAGE => 'إدارة الاستثمارات',
                ],
            ],
            'quick_links' => [
                'label' => 'الروابط السريعة',
                'permissions' => [
                    self::QUICK_LINKS_VIEW => 'عرض الروابط السريعة',
                    self::QUICK_LINKS_MANAGE => 'إدارة الروابط السريعة',
                ],
            ],
            'faq' => [
                'label' => 'الأسئلة الشائعة',
                'permissions' => [
                    self::FAQ_VIEW => 'عرض الأسئلة الشائعة',
                    self::FAQ_MANAGE => 'إدارة الأسئلة الشائعة',
                ],
            ],
            'chat' => [
                'label' => 'المحادثات',
                'permissions' => [
                    self::CHAT_VIEW => 'عرض المحادثات',
                    self::CHAT_MANAGE => 'إدارة المحادثات',
                ],
            ],
            'newsletter' => [
                'label' => 'النشرة البريدية',
                'permissions' => [
                    self::NEWSLETTER_VIEW => 'عرض النشرة البريدية',
                    self::NEWSLETTER_MANAGE => 'إدارة النشرة البريدية',
                ],
            ],
            'promotional' => [
                'label' => 'الأقسام الترويجية',
                'permissions' => [
                    self::PROMOTIONAL_VIEW => 'عرض الأقسام الترويجية',
                    self::PROMOTIONAL_MANAGE => 'إدارة الأقسام الترويجية',
                ],
            ],
            'notifications' => [
                'label' => 'الإشعارات',
                'permissions' => [
                    self::NOTIFICATIONS_VIEW => 'عرض الإشعارات',
                    self::NOTIFICATIONS_MANAGE => 'إدارة الإشعارات',
                ],
            ],
            'reports' => [
                'label' => 'التقارير',
                'permissions' => [
                    self::REPORTS_VIEW => 'عرض التقارير',
                ],
            ],
            'settings' => [
                'label' => 'إعدادات النظام',
                'permissions' => [
                    self::SETTINGS_MANAGE => 'إدارة الإعدادات',
                ],
            ],
            'backups' => [
                'label' => 'النسخ الاحتياطية',
                'permissions' => [
                    self::BACKUPS_MANAGE => 'إدارة النسخ الاحتياطية',
                ],
            ],
            'audit' => [
                'label' => 'سجلات التدقيق',
                'permissions' => [
                    self::AUDIT_VIEW => 'عرض سجلات التدقيق',
                ],
            ],
        ];
    }

    /**
     * Returns flat list of all individual permissions (excludes wildcards).
     */
    public static function all(): array
    {
        $permissions = [];
        foreach (static::grouped() as $group) {
            foreach ($group['permissions'] as $key => $label) {
                $permissions[$key] = $label;
            }
        }
        return $permissions;
    }
}
