<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasTable('new_site_settings')) {
            Schema::create('new_site_settings', function (Blueprint $table) {
                $table->id();
                $table->string('section');
                $table->string('key');
                $table->json('value_json');
                $table->unique(['section', 'key']);
            });
        }

        if (Schema::hasTable('site_settings')) {
            $existing = DB::table('site_settings')->first();

            if ($existing) {
                $payload = collect((array) $existing)
                    ->except(['id', 'created_at', 'updated_at'])
                    ->filter(fn ($value) => $value !== null);

                foreach ($payload as $key => $value) {
                    DB::table('new_site_settings')->updateOrInsert(
                        ['section' => 'general', 'key' => $key],
                        ['value_json' => json_encode($value)]
                    );
                }
            }

            Schema::dropIfExists('site_settings');
        }

        if (Schema::hasTable('new_site_settings')) {
            Schema::rename('new_site_settings', 'site_settings');
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('site_settings')) {
            return;
        }

        Schema::rename('site_settings', 'normalized_site_settings');

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('Vokasional Disabilitas');
            $table->string('tagline')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('fax')->nullable();
            $table->string('email')->nullable();
            $table->string('logo_path')->nullable();
            $table->timestamps();
        });

        $generalSettings = DB::table('normalized_site_settings')
            ->where('section', 'general')
            ->pluck('value_json', 'key');

        if ($generalSettings->isNotEmpty()) {
            $decode = static function (?string $json, $default = null) {
                if ($json === null) {
                    return $default;
                }

                $decoded = json_decode($json, true);

                return $decoded === null ? $default : $decoded;
            };

            DB::table('site_settings')->insert([
                'site_name' => $decode($generalSettings->get('site_name'), 'Vokasional Disabilitas'),
                'tagline' => $decode($generalSettings->get('tagline')),
                'address' => $decode($generalSettings->get('address')),
                'phone' => $decode($generalSettings->get('phone')),
                'fax' => $decode($generalSettings->get('fax')),
                'email' => $decode($generalSettings->get('email')),
                'logo_path' => $decode($generalSettings->get('logo_path')),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::dropIfExists('normalized_site_settings');
    }
};
