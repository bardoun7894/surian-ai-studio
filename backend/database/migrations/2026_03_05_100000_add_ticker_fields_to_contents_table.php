<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contents', function (Blueprint $table) {
            if (!Schema::hasColumn('contents', 'show_in_ticker')) {
                $table->boolean('show_in_ticker')->default(false)->after('featured');
            }
            if (!Schema::hasColumn('contents', 'ticker_duration')) {
                $table->string('ticker_duration')->nullable()->after('show_in_ticker'); // 24h, 48h, 1w, 1m
            }
            if (!Schema::hasColumn('contents', 'ticker_start_at')) {
                $table->timestamp('ticker_start_at')->nullable()->after('ticker_duration');
            }
        });
    }

    public function down(): void
    {
        Schema::table('contents', function (Blueprint $table) {
            $table->dropColumn(['show_in_ticker', 'ticker_duration', 'ticker_start_at']);
        });
    }
};
