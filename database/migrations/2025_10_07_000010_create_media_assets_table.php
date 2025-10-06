<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->string('collection', 100);
            $table->string('key', 100);
            $table->string('disk', 50)->default('public');
            $table->string('path', 2048);
            $table->string('type', 50)->default('image');
            $table->string('alt')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->unique(['collection', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
