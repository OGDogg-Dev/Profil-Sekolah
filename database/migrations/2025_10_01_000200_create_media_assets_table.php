<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->enum('collection', ['logo', 'hero', 'cover', 'gallery', 'og']);
            $table->string('key')->nullable();
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('type');
            $table->string('alt')->nullable();
            $table->tinyInteger('focal_x')->nullable();
            $table->tinyInteger('focal_y')->nullable();
            $table->timestamps();

            $table->index(['collection', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
