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
        Schema::table('directorates', function (Blueprint $table) {
            $table->boolean('featured')->default(false)->after('description_en');
            $table->index('featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->dropIndex(['featured']);
            $table->dropColumn('featured');
        });
    }
};
