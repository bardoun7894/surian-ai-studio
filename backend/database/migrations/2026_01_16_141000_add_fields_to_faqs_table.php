<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            if (!Schema::hasColumn('faqs', 'category')) {
                $table->string('category')->default('general')->after('is_published');
            }
            if (!Schema::hasColumn('faqs', 'order')) {
                $table->integer('order')->default(0)->after('category');
            }
            if (!Schema::hasColumn('faqs', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('order');
            }
        });
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn(['category', 'order', 'is_active']);
        });
    }
};
