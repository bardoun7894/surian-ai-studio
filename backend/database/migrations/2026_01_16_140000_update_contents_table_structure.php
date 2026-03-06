<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contents', function (Blueprint $table) {
            // Rename body columns to content
            if (Schema::hasColumn('contents', 'body_ar') && !Schema::hasColumn('contents', 'content_ar')) {
                $table->renameColumn('body_ar', 'content_ar');
            }
            if (Schema::hasColumn('contents', 'body_en') && !Schema::hasColumn('contents', 'content_en')) {
                $table->renameColumn('body_en', 'content_en');
            }

            // Rename type to category
            if (Schema::hasColumn('contents', 'type') && !Schema::hasColumn('contents', 'category')) {
                $table->renameColumn('type', 'category');
            }
        });

        Schema::table('contents', function (Blueprint $table) {
            // Add missing columns
            if (!Schema::hasColumn('contents', 'featured')) {
                $table->boolean('featured')->default(false)->after('status');
            }
            if (!Schema::hasColumn('contents', 'priority')) {
                $table->integer('priority')->default(0)->after('featured');
            }
            if (!Schema::hasColumn('contents', 'metadata')) {
                $table->json('metadata')->nullable()->after('priority');
            }
            if (!Schema::hasColumn('contents', 'seo_title_ar')) {
                $table->string('seo_title_ar')->nullable()->after('metadata');
            }
            if (!Schema::hasColumn('contents', 'seo_title_en')) {
                $table->string('seo_title_en')->nullable()->after('seo_title_ar');
            }
            if (!Schema::hasColumn('contents', 'seo_description_ar')) {
                $table->text('seo_description_ar')->nullable()->after('seo_title_en');
            }
            if (!Schema::hasColumn('contents', 'seo_description_en')) {
                $table->text('seo_description_en')->nullable()->after('seo_description_ar');
            }
            if (!Schema::hasColumn('contents', 'tags')) {
                $table->json('tags')->nullable()->after('seo_description_en');
            }
            if (!Schema::hasColumn('contents', 'view_count')) {
                $table->integer('view_count')->default(0)->after('tags');
            }
        });
    }

    public function down(): void
    {
        Schema::table('contents', function (Blueprint $table) {
            // Revert column renames
            if (Schema::hasColumn('contents', 'content_ar')) {
                $table->renameColumn('content_ar', 'body_ar');
            }
            if (Schema::hasColumn('contents', 'content_en')) {
                $table->renameColumn('content_en', 'body_en');
            }
            if (Schema::hasColumn('contents', 'category')) {
                $table->renameColumn('category', 'type');
            }

            // Drop added columns
            $table->dropColumn([
                'featured', 'priority', 'metadata',
                'seo_title_ar', 'seo_title_en',
                'seo_description_ar', 'seo_description_en',
                'tags', 'view_count'
            ]);
        });
    }
};
