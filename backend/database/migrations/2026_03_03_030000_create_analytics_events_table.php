<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type', 50)->index(); // pdf_download, share_click, page_view
            $table->string('content_type', 50)->nullable(); // news, decree, service, etc
            $table->unsignedBigInteger('content_id')->nullable()->index();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('ip', 45)->nullable();
            $table->json('metadata')->nullable(); // platform, referer, etc
            $table->timestamp('created_at')->useCurrent()->index();

            $table->index(['event_type', 'content_type', 'content_id']);
            $table->index(['event_type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
