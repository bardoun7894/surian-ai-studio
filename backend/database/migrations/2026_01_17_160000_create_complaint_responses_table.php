<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create complaint_responses table for staff responses to complaints.
     * Used by ComplaintController::addResponse() for complaint follow-up.
     */
    public function up(): void
    {
        if (Schema::hasTable('complaint_responses')) {
            return;
        }

        Schema::create('complaint_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->boolean('is_internal')->default(false); // Internal notes vs citizen-visible
            $table->boolean('is_resolution')->default(false); // Marks final resolution
            $table->timestamps();

            $table->index('complaint_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaint_responses');
    }
};
