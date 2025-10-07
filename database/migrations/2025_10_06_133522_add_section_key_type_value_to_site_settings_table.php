<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // If the table doesn't exist yet, or the column already exists,
        // skip this migration to avoid duplicate column errors.
        if (! Schema::hasTable('site_settings') || Schema::hasColumn('site_settings', 'section')) {
            return;
        }

        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('section');
            $table->string('key');
            $table->string('type')->default('text');
            $table->text('value')->nullable();
            $table->unique(['section', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Only attempt to drop the columns if the table and column exist.
        if (! Schema::hasTable('site_settings') || ! Schema::hasColumn('site_settings', 'section')) {
            return;
        }

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropUnique(['section', 'key']);
            $table->dropColumn(['section', 'key', 'type', 'value']);
        });
    }
};
