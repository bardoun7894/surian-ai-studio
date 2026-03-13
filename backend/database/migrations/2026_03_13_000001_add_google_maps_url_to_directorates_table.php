<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add google_maps_url column to directorates table.
     *
     * Allows admins to store a Google Maps link for each directorate,
     * which is displayed on the frontend directorate detail page.
     */
    public function up(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->string('google_maps_url', 1024)->nullable()->after('website');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->dropColumn('google_maps_url');
        });
    }
};
