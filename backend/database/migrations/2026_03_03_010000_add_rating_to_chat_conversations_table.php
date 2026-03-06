<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("chat_conversations", function (Blueprint $table) {
            $table->unsignedTinyInteger("rating")->nullable()->after("handoff_closed_at");
            $table->text("feedback")->nullable()->after("rating");
            $table->timestamp("rated_at")->nullable()->after("feedback");
        });
    }

    public function down(): void
    {
        Schema::table("chat_conversations", function (Blueprint $table) {
            $table->dropColumn(["rating", "feedback", "rated_at"]);
        });
    }
};
