<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'label' => 'مدير النظام',
                'permissions' => json_encode(['*']),
            ],
            [
                'name' => 'content_admin',
                'label' => 'مدير المحتوى',
                'permissions' => json_encode([
                    'content.view', 'content.create', 'content.edit',
                    'content.delete', 'content.publish', 'content.feature',
                    'services.view', 'services.manage'
                ]),
            ],
            [
                'name' => 'complaint_admin',
                'label' => 'مدير الشكاوى',
                'permissions' => json_encode([
                    'complaints.view', 'complaints.manage', 'complaints.delete',
                    'complaints.assign', 'complaints.respond',
                    'suggestions.view', 'suggestions.manage',
                    'directorates.view'
                ]),
            ],
            // Legacy roles for backwards compatibility
            [
                'name' => 'admin',
                'label' => 'Administrator',
                'permissions' => json_encode(['*']),
            ],
            [
                'name' => 'content_manager',
                'label' => 'Content Manager',
                'permissions' => json_encode(['content.*']),
            ],
            [
                'name' => 'complaint_officer',
                'label' => 'Complaint Officer',
                'permissions' => json_encode(['complaints.*', 'directorates.*']),
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
