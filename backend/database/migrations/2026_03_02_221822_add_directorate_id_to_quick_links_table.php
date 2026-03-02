<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quick_links', function (Blueprint $table) {
            $table->string('directorate_id')->nullable()->after('section');
            $table->index(['section', 'directorate_id', 'is_active', 'display_order'], 'quick_links_dir_section_idx');
        });
    }

    public function down(): void
    {
        Schema::table('quick_links', function (Blueprint $table) {
            $table->dropIndex('quick_links_dir_section_idx');
            $table->dropColumn('directorate_id');
        });
    }
};
