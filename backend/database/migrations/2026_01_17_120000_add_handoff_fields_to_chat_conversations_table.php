<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * FR-35: Add handoff fields for human agent transfer
     */
    public function up(): void
    {
        Schema::table('chat_conversations', function (Blueprint $table) {
            if (!Schema::hasColumn('chat_conversations', 'handoff_requested')) {
                $table->boolean('handoff_requested')->default(false)->after('metadata');
            }
            if (!Schema::hasColumn('chat_conversations', 'handoff_requested_at')) {
                $table->timestamp('handoff_requested_at')->nullable()->after('handoff_requested');
            }
            if (!Schema::hasColumn('chat_conversations', 'handoff_reason')) {
                $table->string('handoff_reason')->nullable()->after('handoff_requested_at');
            }
            if (!Schema::hasColumn('chat_conversations', 'handoff_status')) {
                $table->string('handoff_status')->nullable()->after('handoff_reason'); // pending, assigned, closed
            }
            if (!Schema::hasColumn('chat_conversations', 'handoff_assigned_to')) {
                $table->foreignId('handoff_assigned_to')->nullable()->after('handoff_status')
                      ->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('chat_conversations', 'handoff_assigned_at')) {
                $table->timestamp('handoff_assigned_at')->nullable()->after('handoff_assigned_to');
            }
            if (!Schema::hasColumn('chat_conversations', 'handoff_closed_at')) {
                $table->timestamp('handoff_closed_at')->nullable()->after('handoff_assigned_at');
            }
        });

        // Indexes - using try catch for indexes as simple existence check is harder
        try {
            Schema::table('chat_conversations', function (Blueprint $table) {
                $table->index('handoff_requested');
            });
        } catch (\Exception $e) {}
        
        try {
            Schema::table('chat_conversations', function (Blueprint $table) {
                $table->index('handoff_status');
            });
        } catch (\Exception $e) {}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_conversations', function (Blueprint $table) {
            $table->dropForeign(['handoff_assigned_to']);
            $table->dropColumn([
                'handoff_requested',
                'handoff_requested_at',
                'handoff_reason',
                'handoff_status',
                'handoff_assigned_to',
                'handoff_assigned_at',
                'handoff_closed_at',
            ]);
        });
    }
};
