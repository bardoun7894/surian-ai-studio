<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * T-SRS2-01: Add rating fields for user satisfaction (FR-25)
     * T-SRS2-06: Add snooze field for complaints (FR-35)
     */
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            // User satisfaction rating (1-5 stars) - FR-25
            $table->tinyInteger('rating')->nullable()->after('ai_suggested_directorate_id');
            $table->text('rating_comment')->nullable()->after('rating');
            $table->timestamp('rated_at')->nullable()->after('rating_comment');

            // Snooze feature for complaints - FR-35
            $table->timestamp('snoozed_until')->nullable()->after('rated_at');
            $table->unsignedBigInteger('snoozed_by')->nullable()->after('snoozed_until');

            // Add foreign key for snoozed_by
            $table->foreign('snoozed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropForeign(['snoozed_by']);
            $table->dropColumn(['rating', 'rating_comment', 'rated_at', 'snoozed_until', 'snoozed_by']);
        });
    }
};
