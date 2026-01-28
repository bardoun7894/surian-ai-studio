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
        // Add indexes to complaints table
        Schema::table('complaints', function (Blueprint $table) {
            $table->index('status');
            $table->index('priority');
            $table->index('created_at');
            $table->index('national_id');
            $table->index(['status', 'directorate_id']); // Composite index for common query
            $table->index(['status', 'created_at']); // For dashboard queries
        });

        // Add indexes to contents table
        Schema::table('contents', function (Blueprint $table) {
            $table->index('type');
            $table->index('status');
            $table->index('published_at');
            $table->index('created_at');
            $table->index(['type', 'status']); // Composite for content listing
            $table->index(['status', 'published_at']); // For published content queries
        });

        // Add indexes to users table for common lookups
        Schema::table('users', function (Blueprint $table) {
            $table->index('national_id');
            $table->index('phone');
            $table->index('is_active');
            $table->index('created_at');
        });

        // Add indexes to audit_logs table
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index('action');
            $table->index('auditable_type');
            $table->index('created_at');
            $table->index(['auditable_type', 'auditable_id']); // For polymorphic queries
            $table->index(['user_id', 'created_at']); // For user activity queries
        });

        // Add indexes to newsletter_subscribers table
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->index('status');
            $table->index('subscribed_at');
        });

        // Add indexes to promotional_sections table
        Schema::table('promotional_sections', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('position');
            $table->index('display_order');
            $table->index(['is_active', 'position']); // For active sections by position
        });

        // Add indexes to services table
        Schema::table('services', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('display_order');
        });

        // Add indexes to faqs table
        Schema::table('faqs', function (Blueprint $table) {
            $table->index('is_published');
            $table->index('order');
            $table->index('category');
        });

        // Add indexes to chat_conversations table
        Schema::table('chat_conversations', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
            $table->index(['user_id', 'status']); // For user conversation queries
        });

        // Add index to complaint_responses table
        Schema::table('complaint_responses', function (Blueprint $table) {
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['priority']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['national_id']);
            $table->dropIndex(['status', 'directorate_id']);
            $table->dropIndex(['status', 'created_at']);
        });

        Schema::table('contents', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['status']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['type', 'status']);
            $table->dropIndex(['status', 'published_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['national_id']);
            $table->dropIndex(['phone']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['action']);
            $table->dropIndex(['auditable_type']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['auditable_type', 'auditable_id']);
            $table->dropIndex(['user_id', 'created_at']);
        });

        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['subscribed_at']);
        });

        Schema::table('promotional_sections', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['position']);
            $table->dropIndex(['display_order']);
            $table->dropIndex(['is_active', 'position']);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['display_order']);
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->dropIndex(['is_published']);
            $table->dropIndex(['order']);
            $table->dropIndex(['category']);
        });

        Schema::table('chat_conversations', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['user_id', 'status']);
        });

        Schema::table('complaint_responses', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
        });
    }
};
