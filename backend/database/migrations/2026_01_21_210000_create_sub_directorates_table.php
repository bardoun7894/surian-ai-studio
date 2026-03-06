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
        Schema::create('sub_directorates', function (Blueprint $table) {
            $table->id();
            $table->string('parent_directorate_id'); // String to match directorates.id
            $table->foreign('parent_directorate_id')
                ->references('id')
                ->on('directorates')
                ->onDelete('cascade');
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('url');
            $table->boolean('is_external')->default(false);
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['parent_directorate_id', 'is_active']);
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_directorates');
    }
};
