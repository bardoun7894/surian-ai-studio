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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
            $table->string('directorate_id')->nullable();
            $table->foreign('directorate_id')->references('id')->on('directorates')->nullOnDelete();
            $table->string('national_id')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('otp')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['directorate_id']);
            $table->dropColumn(['role_id', 'directorate_id', 'national_id', 'phone', 'is_active', 'otp', 'otp_expires_at']);
        });
    }
};
