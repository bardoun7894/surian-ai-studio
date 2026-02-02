<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quick_links', function (Blueprint $table) {
            $table->id();
            $table->string('label_ar');
            $table->string('label_en');
            $table->string('url');
            $table->string('icon')->nullable();
            $table->string('section')->default('homepage'); // homepage, footer
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['section', 'is_active', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quick_links');
    }
};
