<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('jeweller_staff', function (Blueprint $table) {
            $table->unsignedBigInteger('jeweller_id')->nullable()->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('jeweller_staff', function (Blueprint $table) {
            $table->dropForeign(['jeweller_id']);
            $table->dropColumn('jeweller_id');
        });
    }
};
