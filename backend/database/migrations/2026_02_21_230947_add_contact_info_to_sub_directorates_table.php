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
        Schema::table('sub_directorates', function (Blueprint $table) {
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address_ar')->nullable();
            $table->string('address_en')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sub_directorates', function (Blueprint $table) {
            $table->dropColumn([
                'description_ar',
                'description_en',
                'phone',
                'email',
                'address_ar',
                'address_en'
            ]);
        });
    }
};
