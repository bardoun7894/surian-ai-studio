<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('system_settings')->insertOrIgnore([
            'key' => 'social_instagram',
            'value' => '',
            'type' => 'string',
            'group' => 'social',
            'label_ar' => 'رابط إنستغرام',
            'label_en' => 'Instagram URL',
            'is_public' => true,
            'is_encrypted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('system_settings')->where('key', 'social_instagram')->delete();
    }
};
