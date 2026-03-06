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
        Schema::table('complaints', function (Blueprint $table) {
            $table->foreignId('related_complaint_id')
                ->nullable()
                ->after('directorate_id')
                ->constrained('complaints')
                ->onDelete('set null');
            
            $table->index('related_complaint_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropForeign(['related_complaint_id']);
            $table->dropIndex(['related_complaint_id']);
            $table->dropColumn('related_complaint_id');
        });
    }
};
