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
                'label' => 'مدير النظام',
                'permissions' => json_encode([Permission::SUPER_ADMIN]),
            ],
            [
                'name' => 'content_admin',
                'label' => 'مدير المحتوى',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::CONTENT_ALL,
                    Permission::SERVICES_ALL,
                    Permission::FAQ_ALL,
                    Permission::NEWSLETTER_ALL,
                    Permission::PROMOTIONAL_ALL,
                ]),
            ],
            [
                'name' => 'complaint_admin',
                'label' => 'مدير الشكاوى',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::COMPLAINTS_ALL,
                    Permission::SUGGESTIONS_ALL,
                    Permission::DIRECTORATES_VIEW,
                    Permission::REPORTS_VIEW,
                ]),
            ],
            [
                'name' => 'admin',
                'label' => 'Administrator',
                'permissions' => json_encode([Permission::SUPER_ADMIN]),
            ],
            [
                'name' => 'content_manager',
                'label' => 'Content Manager',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::CONTENT_ALL,
                    Permission::SERVICES_ALL,
                ]),
            ],
            [
                'name' => 'complaint_officer',
                'label' => 'Complaint Officer',
                'permissions' => json_encode([
                    Permission::ADMIN_PANEL,
                    Permission::COMPLAINTS_ALL,
                    Permission::DIRECTORATES_ALL,
                ]),
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                $role
            );
        }
    }
}
