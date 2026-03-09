<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_application_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investment_application_id')->constrained('investment_applications')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type');
            $table->integer('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investment_application_attachments');
    }
};
