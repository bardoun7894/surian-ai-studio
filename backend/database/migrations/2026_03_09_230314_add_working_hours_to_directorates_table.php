<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->string('working_hours_ar')->nullable()->after('website');
            $table->string('working_hours_en')->nullable()->after('working_hours_ar');
        });
    }

    public function down(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->dropColumn(['working_hours_ar', 'working_hours_en']);
        });
    }
};
