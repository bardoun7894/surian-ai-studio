<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add unique index to phone column on users table.
     *
     * Security fix: The phone number is used for user login. Without a unique
     * constraint, duplicate phone numbers could allow one user to access
     * another user's account by entering a shared phone number with a valid password.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unique('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['phone']);
        });
    }
};
