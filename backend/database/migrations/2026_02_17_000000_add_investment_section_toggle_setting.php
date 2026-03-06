<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('system_settings')->insertOrIgnore([
            'key' => 'investment_section_enabled',
            'value' => 'true',
            'type' => 'boolean',
            'group' => 'feature_flags',
            'label_ar' => 'تفعيل قسم الاستثمار',
            'label_en' => 'Enable Investment Section',
            'description_ar' => 'إظهار أو إخفاء قسم الاستثمار من الصفحة الرئيسية',
            'description_en' => 'Show or hide the investment section on the homepage',
            'is_public' => true,
            'is_encrypted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('system_settings')->where('key', 'investment_section_enabled')->delete();
    }
};
