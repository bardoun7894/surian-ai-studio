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
        Schema::create('promotional_sections', function (Blueprint $table) {
            $table->id();

            // Bilingual content
            $table->string('title_ar');
            $table->string('title_en');
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('button_text_ar')->nullable();
            $table->string('button_text_en')->nullable();

            // Visual settings
            $table->string('image')->nullable();
            $table->string('background_color', 20)->default('#1A2E1A'); // hex color
            $table->string('icon', 50)->default('Play'); // Lucide icon name

            // Configuration
            $table->string('button_url')->nullable();
            $table->enum('type', ['banner', 'video', 'promo', 'stats'])->default('promo');
            $table->enum('position', ['hero', 'grid_main', 'grid_side', 'grid_bottom'])->default('grid_bottom');

            // Display settings
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes for common queries
            $table->index(['position', 'is_active', 'display_order']);
            $table->index(['type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotional_sections');
    }
};
