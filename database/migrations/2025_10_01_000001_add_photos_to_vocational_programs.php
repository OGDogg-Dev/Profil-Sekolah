<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vocational_programs', function (Blueprint $table) {
            $table->json('photos')->nullable()->after('mentors');
        });
    }

    public function down(): void
    {
        Schema::table('vocational_programs', function (Blueprint $table) {
            $table->dropColumn('photos');
        });
    }
};
