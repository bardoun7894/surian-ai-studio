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
        Schema::create('suggestion_ratings', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number');
            $table->integer('rating')->comment('1-5 stars');
            $table->text('comment')->nullable();
            $table->enum('feedback_type', ['positive', 'negative'])->nullable()->comment('Was the response helpful');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index('tracking_number');
            $table->index('rating');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suggestion_ratings');
    }
};
