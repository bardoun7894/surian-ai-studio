<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * T-SRS2-12, T-SRS2-13: Add escalation tracking fields (FR-68, FR-69)
     */
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->tinyInteger('escalation_level')->nullable()->default(0)->after('snoozed_by');
            $table->timestamp('first_warning_at')->nullable()->after('escalation_level');
            $table->timestamp('final_escalation_at')->nullable()->after('first_warning_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropColumn(['escalation_level', 'first_warning_at', 'final_escalation_at']);
        });
    }
};
