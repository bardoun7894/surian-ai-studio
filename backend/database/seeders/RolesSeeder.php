<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Enums\Permission;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'label' => 'مدير النظام الأعلى',
                'permissions' => json_encode([Permission::SUPER_ADMIN]),
            ],
            [
                'name' => 'admin',
                'label' => 'مدير النظام',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::CONTENT_ALL,
                    Permission::COMPLAINTS_ALL,
                    Permission::SUGGESTIONS_ALL,
                    Permission::USERS_ALL,
                    Permission::SERVICES_ALL,
                    Permission::DIRECTORATES_ALL,
                    Permission::SUB_DIRECTORATES_ALL,
                    Permission::FAQ_ALL,
                    Permission::NEWSLETTER_ALL,
                    Permission::PROMOTIONAL_ALL,
                    Permission::INVESTMENTS_ALL,
                    Permission::QUICK_LINKS_ALL,
                    Permission::CHAT_ALL,
                    Permission::NOTIFICATIONS_ALL,
                    Permission::COMPLAINT_TEMPLATES_ALL,
                    Permission::REPORTS_VIEW,
                    Permission::ROLES_ALL,
                ]),
            ],
            [
                'name' => 'content_creator',
                'label' => 'منشئ المحتوى',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::CONTENT_VIEW,
                    Permission::CONTENT_CREATE,
                    Permission::CONTENT_EDIT,
                    // Content types this role can access
                    Permission::CONTENT_NEWS,
                    Permission::CONTENT_ANNOUNCEMENT,
                    Permission::CONTENT_MEDIA,
                    Permission::FAQ_VIEW,
                    Permission::FAQ_MANAGE,
                    Permission::SERVICES_VIEW,
                    Permission::NEWSLETTER_VIEW,
                    Permission::PROMOTIONAL_VIEW,
                    Permission::QUICK_LINKS_VIEW,
                    Permission::INVESTMENTS_VIEW,
                ]),
            ],
            [
                'name' => 'complaint_admin',
                'label' => 'مدير الشكاوى',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::COMPLAINTS_ALL,
                    Permission::SUGGESTIONS_ALL,
                    Permission::COMPLAINT_TEMPLATES_ALL,
                    Permission::DIRECTORATES_VIEW,
                    Permission::REPORTS_VIEW,
                ]),
            ],
            [
                'name' => 'complaint_officer',
                'label' => 'موظف الشكاوى',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::COMPLAINTS_VIEW,
                    Permission::COMPLAINTS_UPDATE,
                    Permission::COMPLAINTS_RESPOND,
                    Permission::SUGGESTIONS_VIEW,
                    Permission::DIRECTORATES_VIEW,
                ]),
            ],
            [
                'name' => 'citizen',
                'label' => 'مواطن',
                'permissions' => json_encode([
                    'complaints.view',
                    'complaints.create',
                    'profile.view',
                    'profile.update',
                ]),
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                $role
            );
        }

        // Clean up old roles that have no users assigned
        DB::table('roles')
            ->whereIn('name', ['content_admin', 'content_manager'])
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('users')
                    ->whereColumn('users.role_id', 'roles.id');
            })
            ->delete();
    }
}
