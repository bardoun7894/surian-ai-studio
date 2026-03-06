<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question_ar');
            $table->text('question_en')->nullable();
            $table->text('answer_ar');
            $table->text('answer_en')->nullable();
            $table->string('category')->nullable(); // Added
            $table->integer('order')->default(0); // Added
            $table->boolean('is_active')->default(true); // Added
            $table->boolean('suggested_by_ai')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
