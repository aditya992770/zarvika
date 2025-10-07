<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customer_kitties', function (Blueprint $table) {
            $table->id(); // auto-increment integer
            $table->unsignedBigInteger('kitty_id'); // FK to kitties
            $table->foreign('kitty_id')->references('id')->on('kitties')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('jeweller_customers')->cascadeOnDelete();
            $table->string('kitty_name');
            $table->enum('kitty_type', ['gold', 'silver', 'custom']);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('target_amount', 15, 2);
            $table->decimal('collected_amount', 15, 2)->default(0);
            $table->enum('status', ['active', 'completed', 'paused'])->default('active');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_kitties');
    }
};
