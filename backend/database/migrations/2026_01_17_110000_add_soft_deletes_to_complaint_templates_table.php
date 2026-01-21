<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * FR-30: Add archive functionality to complaint templates
     */
    public function up(): void
    {
        Schema::table('complaint_templates', function (Blueprint $table) {
            if (!Schema::hasColumn('complaint_templates', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complaint_templates', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
