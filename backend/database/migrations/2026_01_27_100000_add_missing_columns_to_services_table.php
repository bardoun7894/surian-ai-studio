<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('icon')->nullable()->after('description_en');
            $table->string('category')->nullable()->after('icon');
            $table->boolean('is_active')->default(true)->after('is_digital');
            $table->string('url')->nullable()->after('is_active');
            $table->string('fees')->nullable()->after('url');
            $table->string('estimated_time')->nullable()->after('fees');
            $table->integer('display_order')->default(0)->after('estimated_time');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['icon', 'category', 'is_active', 'url', 'fees', 'estimated_time', 'display_order']);
        });
    }
};
