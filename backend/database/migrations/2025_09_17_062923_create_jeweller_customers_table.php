<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jeweller_customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jeweller_id')->constrained('users')->onDelete('cascade'); // owner jeweller
            $table->string('full_name');
            $table->string('email');
            $table->string('mobile');
            $table->date('dob')->nullable();
            $table->date('anniversary')->nullable();
            $table->enum('customer_type', ['regular','vip','walk-in','online'])->default('regular');
            $table->string('aadhar_number')->nullable();
            $table->text('permanent_address')->nullable();
            $table->text('residence_address')->nullable();
            $table->json('kyc_documents')->nullable();
            $table->foreignId('assigned_staff_id')->nullable()->constrained('users')->onDelete('set null'); // staff responsible
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jeweller_customers');
    }
};
