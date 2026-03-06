<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * FR-36: Create content embeddings table for semantic search
     *
     * NOTE: Requires pgvector extension to be installed:
     * CREATE EXTENSION IF NOT EXISTS vector;
     */
    public function up(): void
    {
        // Check if pgvector extension is available
        $hasVector = false;
        try {
            $result = DB::select("SELECT * FROM pg_extension WHERE extname = 'vector'");
            $hasVector = count($result) > 0;
        } catch (\Exception $e) {
            // Extension check failed
        }

        if (!Schema::hasTable('content_embeddings')) {
            Schema::create('content_embeddings', function (Blueprint $table) use ($hasVector) {
                $table->id();
                $table->foreignId('content_id')->constrained()->onDelete('cascade');
                $table->string('content_type')->default('content'); // content, faq, service, etc.
                $table->text('text_chunk'); // The text that was embedded
                $table->integer('chunk_index')->default(0); // For multi-chunk content
                $table->string('language', 5)->default('ar');
                $table->string('model_version')->nullable(); // Track which embedding model was used
                $table->timestamps();

                $table->index(['content_id', 'content_type']);
                $table->index('language');
            });
        }

        // Add vector column if pgvector is available
        if ($hasVector) {
            DB::statement('ALTER TABLE content_embeddings ADD COLUMN IF NOT EXISTS embedding vector(1536)');
            try {
                DB::statement('CREATE INDEX ON content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)');
            } catch (\Exception $e) {}
        } else {
            // Fallback: store as JSON if pgvector not available
            DB::statement('ALTER TABLE content_embeddings ADD COLUMN IF NOT EXISTS embedding_json JSONB');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_embeddings');
    }
};
