<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * FR-43: FAQ Suggestions from chatbot conversations
     */
    public function up(): void
    {
        Schema::create('faq_suggestions', function (Blueprint $table) {
            $table->id();
            $table->text('question_ar');
            $table->text('question_en')->nullable();
            $table->text('answer_ar');
            $table->text('answer_en')->nullable();
            $table->string('category')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->integer('occurrence_count')->default(1); // How many times similar question was asked
            $table->json('source_conversations')->nullable(); // References to chat conversations
            $table->float('confidence_score')->nullable(); // AI confidence in the suggestion
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->foreignId('created_faq_id')->nullable()->constrained('faqs')->onDelete('set null');
            $table->timestamps();

            $table->index('status');
            $table->index('occurrence_count');
            $table->index('confidence_score');
        });

        // Add embedding column to faqs for similarity search
        $hasVector = false;
        try {
            $result = DB::select("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') as exists");
            $hasVector = $result[0]->exists ?? false;
        } catch (\Exception $e) {
            // Extension check failed
        }

        if ($hasVector) {
            Schema::table('faqs', function (Blueprint $table) {
                $table->vector('embedding', 1024)->nullable()->after('is_active');
                $table->string('embedding_model')->nullable()->after('embedding');
            });
        } else {
            Schema::table('faqs', function (Blueprint $table) {
                $table->jsonb('embedding_json')->nullable()->after('is_active');
                $table->string('embedding_model')->nullable()->after('embedding_json');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('faq_suggestions');

        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn(['embedding', 'embedding_model']);
        });
    }
};
