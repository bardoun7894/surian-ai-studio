<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->string('directorate_id')->nullable()->after('category');
            $table->foreign('directorate_id')->references('id')->on('directorates')->onDelete('set null');
            $table->index('directorate_id');
        });
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropForeign(['directorate_id']);
            $table->dropIndex(['directorate_id']);
            $table->dropColumn('directorate_id');
        });
    }
};
