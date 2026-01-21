<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComplaintTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'directorate_id' => 'd6', // Electricity
                'name' => 'انقطاع تيار كهربائي',
                'fields' => json_encode(['address_details', 'meter_number', 'outage_duration']),
                'is_active' => true,
            ],
            [
                'directorate_id' => 'd7', // Water
                'name' => 'تسرب مياه',
                'fields' => json_encode(['address_details', 'leak_severity', 'photo_evidence']),
                'is_active' => true,
            ],
            [
                'directorate_id' => 'd9', // Communications
                'name' => 'ضعف سرعة الإنترنت',
                'fields' => json_encode(['phone_number', 'provider', 'speed_test_result']),
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            DB::table('complaint_templates')->updateOrInsert(
                ['name' => $template['name'], 'directorate_id' => $template['directorate_id']],
                $template
            );
        }
    }
}
