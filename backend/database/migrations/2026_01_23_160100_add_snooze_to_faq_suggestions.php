<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * T-SRS2-06: Add snooze field for FAQ suggestions (FR-58)
     */
    public function up(): void
    {
        Schema::table('faq_suggestions', function (Blueprint $table) {
            $table->timestamp('snoozed_until')->nullable()->after('created_faq_id');
            $table->unsignedBigInteger('snoozed_by')->nullable()->after('snoozed_until');

            $table->foreign('snoozed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faq_suggestions', function (Blueprint $table) {
            $table->dropForeign(['snoozed_by']);
            $table->dropColumn(['snoozed_until', 'snoozed_by']);
        });
    }
};
