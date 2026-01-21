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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();
            
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('directorate_id')->nullable();
            $table->foreign('directorate_id')->references('id')->on('directorates')->nullOnDelete();
            
            $table->foreignId('template_id')->nullable()->constrained('complaint_templates')->nullOnDelete();
            
            // Personal Info (snapshot for history or guest)
            $table->string('full_name');
            $table->string('national_id');
            $table->string('phone');
            $table->string('email')->nullable();
            
            // Content
            $table->string('title')->nullable();
            $table->text('description');
            
            // Status & Classification
            $table->string('status')->default('new'); // new, in_progress, resolved, rejected
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            
            // AI Analysis
            $table->text('ai_summary')->nullable();
            $table->string('ai_category')->nullable();
            $table->string('ai_priority')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
