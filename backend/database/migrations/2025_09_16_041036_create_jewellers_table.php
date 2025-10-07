<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jewellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // link to users table
            $table->string('business_name');
            $table->text('address')->nullable();
            $table->string('logo')->nullable();
            $table->enum('status', ['Active', 'Suspended', 'Pending'])->default('Pending');
            $table->timestamps(); // includes created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jewellers');
    }
};
