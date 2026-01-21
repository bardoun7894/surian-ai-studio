<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * FR-13: Service attachments support
     */
    public function up(): void
    {
        Schema::create('content_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->constrained()->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type')->nullable(); // document, image, video, etc.
            $table->string('mime_type');
            $table->bigInteger('file_size'); // bytes
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_public')->default(true); // Can be downloaded by public
            $table->integer('download_count')->default(0);
            $table->timestamps();

            $table->index('content_id');
            $table->index('file_type');
            $table->index('is_public');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_attachments');
    }
};
