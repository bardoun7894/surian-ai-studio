<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * FR-39: Create complaint_summaries table for storing AI-generated
     * recurring complaint analysis reports.
     */
    public function up(): void
    {
        if (Schema::hasTable('complaint_summaries')) {
            return;
        }

        Schema::create('complaint_summaries', function (Blueprint $table) {
            $table->id();
            $table->string('period_type')->default('weekly'); // daily, weekly, monthly
            $table->date('period_start');
            $table->date('period_end');
            $table->string('directorate_id')->nullable();
            $table->foreign('directorate_id')->references('id')->on('directorates')->nullOnDelete();
            $table->string('category')->nullable(); // AI category if specific
            $table->integer('total_complaints')->default(0);
            $table->integer('resolved_count')->default(0);
            $table->integer('pending_count')->default(0);
            $table->json('status_breakdown')->nullable(); // {new: 5, in_progress: 3, ...}
            $table->json('priority_breakdown')->nullable(); // {high: 2, medium: 5, low: 3}
            $table->json('top_categories')->nullable(); // [{category: 'x', count: 5}, ...]
            $table->json('recurring_issues')->nullable(); // AI-identified patterns
            $table->text('ai_summary_ar')->nullable(); // Arabic AI summary
            $table->text('ai_summary_en')->nullable(); // English AI summary
            $table->text('ai_recommendations')->nullable(); // AI recommendations
            $table->json('keywords')->nullable(); // Common keywords from complaints
            $table->float('avg_resolution_days')->nullable();
            $table->float('ai_confidence')->nullable();
            $table->timestamps();

            // Indexes for efficient querying
            $table->index(['period_type', 'period_start', 'period_end']);
            $table->index('directorate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaint_summaries');
    }
};
