<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * FR-19: AI classification fields for complaints
     */
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            // Add AI analysis fields if they don't exist
            if (!Schema::hasColumn('complaints', 'ai_keywords')) {
                $table->json('ai_keywords')->nullable()->after('ai_priority');
            }
            if (!Schema::hasColumn('complaints', 'ai_confidence')) {
                $table->float('ai_confidence')->nullable()->after('ai_keywords');
            }
            if (!Schema::hasColumn('complaints', 'ai_suggested_directorate_id')) {
                // Note: No foreign key constraint as directorates uses string ID
                // and this column may be created as bigint in some environments
                $table->unsignedBigInteger('ai_suggested_directorate_id')->nullable()->after('ai_confidence');
            }
            if (!Schema::hasColumn('complaints', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $columns = ['ai_keywords', 'ai_confidence', 'ai_suggested_directorate_id', 'deleted_at'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('complaints', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
