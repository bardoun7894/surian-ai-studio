<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'announcements_homepage_count',
                'value' => '9',
                'type' => 'integer',
                'group' => 'ui',
                'label_ar' => 'عدد الإعلانات في الصفحة الرئيسية',
                'label_en' => 'Announcements Count (Homepage)',
                'description_ar' => 'عدد بطاقات الإعلانات التي تظهر في شبكة الإعلانات بالصفحة الرئيسية',
                'description_en' => 'Number of announcement cards displayed in the homepage grid',
                'is_public' => true,
                'is_encrypted' => false,
                'settings' => ['min' => 3, 'max' => 30, 'step' => 3],
            ],
            [
                'key' => 'featured_directorates_count',
                'value' => '3',
                'type' => 'integer',
                'group' => 'ui',
                'label_ar' => 'عدد المديريات المميزة',
                'label_en' => 'Featured Directorates Count',
                'is_public' => true,
                'is_encrypted' => false,
                'settings' => ['min' => 3, 'max' => 6],
            ],
            [
                 'key' => 'suggestions_enabled',
                 'value' => 'true',
                 'type' => 'boolean',
                 'group' => 'feature_flags',
                 'label_ar' => 'تفعيل بوابة المقترحات',
                 'label_en' => 'Enable Suggestions Portal',
                 'is_public' => true,
                 'is_encrypted' => false,
            ]
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
