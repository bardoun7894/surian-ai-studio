<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * T081: Add map location columns to directorates table.
     */
    public function up(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('featured');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->text('address_ar')->nullable()->after('longitude');
            $table->text('address_en')->nullable()->after('address_ar');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'address_ar', 'address_en']);
        });
    }
};
