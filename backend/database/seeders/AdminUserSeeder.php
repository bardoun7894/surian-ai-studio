<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure roles exist
        $superAdminRole = DB::table('roles')->where('name', 'super_admin')->first();

        if (!$superAdminRole) {
            $this->call(RolesSeeder::class);
        }

        $testUsers = [
            [
                'email' => 'superadmin@economy.gov.sy',
                'first_name' => 'مدير',
                'father_name' => 'النظام',
                'last_name' => 'الأعلى',
                'role_name' => 'super_admin',
            ],
            [
                'email' => 'admin@economy.gov.sy',
                'first_name' => 'مدير',
                'father_name' => '',
                'last_name' => 'النظام',
                'role_name' => 'admin',
            ],
            [
                'email' => 'content@economy.gov.sy',
                'first_name' => 'منشئ',
                'father_name' => '',
                'last_name' => 'المحتوى',
                'role_name' => 'content_creator',
            ],
            [
                'email' => 'complaints@economy.gov.sy',
                'first_name' => 'مدير',
                'father_name' => '',
                'last_name' => 'الشكاوى',
                'role_name' => 'complaint_admin',
            ],
            [
                'email' => 'officer@economy.gov.sy',
                'first_name' => 'موظف',
                'father_name' => '',
                'last_name' => 'الشكاوى',
                'role_name' => 'complaint_officer',
            ],
        ];

        foreach ($testUsers as $userData) {
            $role = DB::table('roles')->where('name', $userData['role_name'])->first();

            if ($role) {
                User::updateOrCreate(
                    ['email' => $userData['email']],
                    [
                        'first_name' => $userData['first_name'],
                        'father_name' => $userData['father_name'],
                        'last_name' => $userData['last_name'],
                        'password' => Hash::make('password'),
                        'role_id' => $role->id,
                        'is_active' => true,
                        'email_verified_at' => now(),
                    ]
                );
            }
        }
    }
}
