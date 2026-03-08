<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_applications', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();
            $table->foreignId('investment_id')->nullable()->constrained('investments')->nullOnDelete();
            $table->string('full_name');
            $table->string('national_id', 11);
            $table->string('company_name');
            $table->string('email');
            $table->string('phone');
            $table->decimal('proposed_amount', 15, 2);
            $table->text('description')->nullable();
            $table->enum('status', ['received', 'under_review', 'needs_more_info', 'approved', 'rejected'])->default('received');
            $table->text('staff_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('tracking_number');
            $table->index('status');
            $table->index('national_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investment_applications');
    }
};
