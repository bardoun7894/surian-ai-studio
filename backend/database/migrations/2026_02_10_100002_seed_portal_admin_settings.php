<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * T075: Seed admin-configurable portal settings.
     */
    public function up(): void
    {
        $settings = [
            [
                'key' => 'investment_section_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'portal',
                'label_ar' => 'تفعيل قسم الاستثمار',
                'label_en' => 'Investment Section Enabled',
                'description_ar' => 'إظهار أو إخفاء قسم الاستثمار في البوابة',
                'description_en' => 'Show or hide the investment section on the portal',
                'is_public' => true,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'complaint_rules_ar',
                'value' => '',
                'type' => 'string',
                'group' => 'portal',
                'label_ar' => 'قواعد تقديم الشكاوى (عربي)',
                'label_en' => 'Complaint Submission Rules (Arabic)',
                'description_ar' => 'القواعد والشروط المعروضة عند تقديم شكوى - النص العربي',
                'description_en' => 'Rules and conditions displayed when submitting a complaint - Arabic text',
                'is_public' => true,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'complaint_rules_en',
                'value' => '',
                'type' => 'string',
                'group' => 'portal',
                'label_ar' => 'قواعد تقديم الشكاوى (إنجليزي)',
                'label_en' => 'Complaint Submission Rules (English)',
                'description_ar' => 'القواعد والشروط المعروضة عند تقديم شكوى - النص الإنجليزي',
                'description_en' => 'Rules and conditions displayed when submitting a complaint - English text',
                'is_public' => true,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'suggestion_rules_ar',
                'value' => '',
                'type' => 'string',
                'group' => 'portal',
                'label_ar' => 'قواعد تقديم المقترحات (عربي)',
                'label_en' => 'Suggestion Submission Rules (Arabic)',
                'description_ar' => 'القواعد والشروط المعروضة عند تقديم مقترح - النص العربي',
                'description_en' => 'Rules and conditions displayed when submitting a suggestion - Arabic text',
                'is_public' => true,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'suggestion_rules_en',
                'value' => '',
                'type' => 'string',
                'group' => 'portal',
                'label_ar' => 'قواعد تقديم المقترحات (إنجليزي)',
                'label_en' => 'Suggestion Submission Rules (English)',
                'description_ar' => 'القواعد والشروط المعروضة عند تقديم مقترح - النص الإنجليزي',
                'description_en' => 'Rules and conditions displayed when submitting a suggestion - English text',
                'is_public' => true,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('system_settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('system_settings')->whereIn('key', [
            'investment_section_enabled',
            'complaint_rules_ar',
            'complaint_rules_en',
            'suggestion_rules_ar',
            'suggestion_rules_en',
        ])->delete();
    }
};
