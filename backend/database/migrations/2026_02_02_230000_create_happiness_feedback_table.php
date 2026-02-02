<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('happiness_feedback', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('rating'); // 1=sad, 2=neutral, 3=happy
            $table->string('page', 255)->nullable(); // Page URL where feedback was given
            $table->string('session_id', 64)->nullable(); // To prevent duplicate submissions
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('happiness_feedback');
    }
};
