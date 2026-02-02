<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->string('national_id')->nullable()->change();
            $table->string('phone')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->string('national_id')->nullable(false)->change();
            $table->string('phone')->nullable(false)->change();
        });
    }
};
