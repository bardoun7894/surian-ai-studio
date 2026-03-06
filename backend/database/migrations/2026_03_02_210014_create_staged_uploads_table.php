<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * M1-T3: Staged uploads table for immediate file upload before form submission.
     * Files are uploaded here on selection, then linked to the complaint/suggestion on submit.
     * Expired rows (>24h) are cleaned up by a scheduled command.
     */
    public function up(): void
    {
        Schema::create('staged_uploads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('session_token', 64)->index(); // ties uploads to a browser session
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->string('context', 32)->default('complaint'); // complaint | suggestion
            $table->boolean('claimed')->default(false); // true once linked to a complaint
            $table->timestamp('expires_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staged_uploads');
    }
};
