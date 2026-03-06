<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suggestions', function (Blueprint $table) {
            $table->text('ai_summary')->nullable()->after('response');
            $table->string('ai_category')->nullable()->after('ai_summary');
            $table->string('ai_priority')->nullable()->after('ai_category');
            $table->json('ai_keywords')->nullable()->after('ai_priority');
            $table->float('ai_confidence')->nullable()->after('ai_keywords');
            $table->string('ai_suggested_directorate_id')->nullable()->after('ai_confidence');
            $table->foreign('ai_suggested_directorate_id')->references('id')->on('directorates')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('suggestions', function (Blueprint $table) {
            $table->dropForeign(['ai_suggested_directorate_id']);
            $table->dropColumn([
                'ai_summary',
                'ai_category',
                'ai_priority',
                'ai_keywords',
                'ai_confidence',
                'ai_suggested_directorate_id',
            ]);
        });
    }
};
