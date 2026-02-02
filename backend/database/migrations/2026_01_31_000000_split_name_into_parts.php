<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Add new columns (nullable initially)
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('father_name')->nullable()->after('first_name');
            $table->string('last_name')->nullable()->after('father_name');
        });

        // Step 2: Migrate existing name data
        // 1 word -> first_name only
        // 2 words -> first_name + last_name
        // 3+ words -> first_name + father_name + rest into last_name
        DB::statement("
            UPDATE users SET
                first_name = CASE
                    WHEN array_length(string_to_array(TRIM(name), ' '), 1) >= 1
                    THEN split_part(TRIM(name), ' ', 1)
                    ELSE TRIM(name)
                END,
                father_name = CASE
                    WHEN array_length(string_to_array(TRIM(name), ' '), 1) >= 3
                    THEN split_part(TRIM(name), ' ', 2)
                    WHEN array_length(string_to_array(TRIM(name), ' '), 1) = 2
                    THEN ''
                    ELSE ''
                END,
                last_name = CASE
                    WHEN array_length(string_to_array(TRIM(name), ' '), 1) >= 3
                    THEN TRIM(SUBSTRING(TRIM(name) FROM POSITION(split_part(TRIM(name), ' ', 2) IN TRIM(name)) + LENGTH(split_part(TRIM(name), ' ', 2)) + 1))
                    WHEN array_length(string_to_array(TRIM(name), ' '), 1) = 2
                    THEN split_part(TRIM(name), ' ', 2)
                    ELSE ''
                END
        ");

        // Step 3: Set defaults for any remaining nulls
        DB::statement("UPDATE users SET first_name = COALESCE(first_name, '') WHERE first_name IS NULL");
        DB::statement("UPDATE users SET father_name = COALESCE(father_name, '') WHERE father_name IS NULL");
        DB::statement("UPDATE users SET last_name = COALESCE(last_name, '') WHERE last_name IS NULL");

        // Step 4: Make columns NOT NULL
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable(false)->change();
            $table->string('father_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();
        });

        // Step 5: Drop old name column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id')->default('');
        });

        DB::statement("
            UPDATE users SET name = TRIM(
                first_name || ' ' || father_name || ' ' || last_name
            )
        ");

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'father_name', 'last_name']);
        });
    }
};
