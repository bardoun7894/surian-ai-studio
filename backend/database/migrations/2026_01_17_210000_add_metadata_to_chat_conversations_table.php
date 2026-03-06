<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_conversations', function (Blueprint $table) {
            // Add metadata column for storing additional info (ip, user_agent, language)
            if (!Schema::hasColumn('chat_conversations', 'metadata')) {
                $table->json('metadata')->nullable()->after('messages');
            }
        });
    }

    public function down(): void
    {
        Schema::table('chat_conversations', function (Blueprint $table) {
            if (Schema::hasColumn('chat_conversations', 'metadata')) {
                $table->dropColumn('metadata');
            }
        });
    }
};
