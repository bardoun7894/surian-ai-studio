<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        try {
            // Enable pgvector extension (requires PostgreSQL with pgvector installed)
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

            // Add embedding column to contents table for semantic search
            DB::statement('ALTER TABLE contents ADD COLUMN IF NOT EXISTS embedding vector(1024)');
            DB::statement('ALTER TABLE contents ADD COLUMN IF NOT EXISTS embedding_model VARCHAR(100) NULL');
            DB::statement('ALTER TABLE contents ADD COLUMN IF NOT EXISTS embedding_updated_at TIMESTAMP NULL');

            // Create index for fast similarity search
            DB::statement('CREATE INDEX IF NOT EXISTS contents_embedding_idx ON contents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)');
        } catch (\Exception $e) {
            // Log warning but don't fail migration - pgvector might not be installed
            \Log::warning('Vector extension or columns could not be created. Semantic search will be disabled. Error: ' . $e->getMessage());
            
            // Fallback: Add columns as regular JSON if vector type is not available? 
            // Better to just skip and allow other migrations to run.
        }
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS contents_embedding_idx');
        DB::statement('ALTER TABLE contents DROP COLUMN IF EXISTS embedding');
        DB::statement('ALTER TABLE contents DROP COLUMN IF EXISTS embedding_model');
        DB::statement('ALTER TABLE contents DROP COLUMN IF EXISTS embedding_updated_at');
    }
};
