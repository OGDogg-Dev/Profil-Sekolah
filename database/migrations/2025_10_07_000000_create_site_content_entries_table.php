<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_content_entries', function (Blueprint $table) {
            $table->id();
            $table->string('section', 100);
            $table->string('key', 100);
            $table->string('type', 20)->default('text');
            $table->longText('value')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->unique(['section', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_content_entries');
    }
};
