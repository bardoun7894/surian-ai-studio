<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('complaint_templates', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->text('description')->nullable()->after('name_en');
            $table->text('description_en')->nullable()->after('description');
            $table->string('type')->default('standard')->after('description_en');
            $table->boolean('requires_identification')->default(false)->after('type');
            $table->integer('sort_order')->default(0)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complaint_templates', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'description', 'description_en', 'type', 'requires_identification', 'sort_order']);
        });
    }
};
