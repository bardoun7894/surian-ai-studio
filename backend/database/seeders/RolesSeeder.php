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
