<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suggestions', function (Blueprint $table) {
            $table->string('national_id', 11)->nullable()->after('phone');
            $table->date('dob')->nullable()->after('national_id');
            $table->string('directorate_id')->nullable()->after('dob');
            $table->foreign('directorate_id')->references('id')->on('directorates')->nullOnDelete();
            $table->boolean('is_anonymous')->default(false)->after('directorate_id');
        });
    }

    public function down(): void
    {
        Schema::table('suggestions', function (Blueprint $table) {
            $table->dropForeign(['directorate_id']);
            $table->dropColumn(['national_id', 'dob', 'directorate_id', 'is_anonymous']);
        });
    }
};
