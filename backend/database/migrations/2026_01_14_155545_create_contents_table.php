<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // news, decree, announcement
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            $table->text('body_ar');
            $table->text('body_en')->nullable();
            $table->string('slug')->unique();
            
            $table->string('directorate_id')->nullable();
            $table->foreign('directorate_id')->references('id')->on('directorates')->nullOnDelete();
            
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('status')->default('draft'); // draft, published, archived
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
