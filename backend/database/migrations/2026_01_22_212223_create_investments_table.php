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
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->string('title_ar');
            $table->string('title_en');
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('sector_ar');
            $table->string('sector_en');
            $table->string('location_ar');
            $table->string('location_en');
            $table->decimal('investment_amount', 15, 2)->nullable();
            $table->string('currency', 10)->default('USD');
            $table->enum('status', ['available', 'under_review', 'closed'])->default('available');
            $table->enum('category', ['opportunities', 'one-stop', 'licenses', 'guide'])->default('opportunities');
            $table->string('icon')->default('Zap');
            $table->string('image')->nullable();
            $table->json('requirements')->nullable();
            $table->string('fee')->nullable();
            $table->string('processing_time')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
