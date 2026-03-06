<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('complaints', 'ai_suggested_directorate_id')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement(
                "ALTER TABLE complaints ALTER COLUMN ai_suggested_directorate_id TYPE varchar(255) USING ai_suggested_directorate_id::varchar"
            );
            DB::statement("ALTER TABLE complaints ALTER COLUMN ai_suggested_directorate_id DROP NOT NULL");
            return;
        }

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE complaints MODIFY ai_suggested_directorate_id VARCHAR(255) NULL");
            return;
        }

        // Other drivers (e.g. sqlite) are left unchanged to avoid requiring doctrine/dbal.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasColumn('complaints', 'ai_suggested_directorate_id')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement(
                "ALTER TABLE complaints ALTER COLUMN ai_suggested_directorate_id TYPE bigint USING NULLIF(ai_suggested_directorate_id, '')::bigint"
            );
            return;
        }

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE complaints MODIFY ai_suggested_directorate_id BIGINT UNSIGNED NULL");
            return;
        }

        // Other drivers (e.g. sqlite) are left unchanged.
    }
};
