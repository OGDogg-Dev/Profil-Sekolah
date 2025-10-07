<?php

namespace App\Http\Controllers\Admin;

use App\Facades\SiteContent;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\HandlesMediaUpload;
use App\Models\MediaAsset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    use HandlesMediaUpload;

    public function edit(): Response
    {
        $generalKeys = [
            'site_name',
            'tagline',
            'address',
            'phone',
            'whatsapp',
            'email',
            'social',
            'footer_hours',
            'ogImage',
        ];

        $settings = collect($generalKeys)->mapWithKeys(function (string $key) {
            return [$key => SiteContent::getSetting('general', $key)];
        })->all();

        $logo = SiteContent::getMedia('logo', 'global');
        $ogAsset = SiteContent::getMedia('og', 'global');

        return Inertia::render('admin/settings/General', [
            'settings' => array_merge($settings, [
                'logo_url' => $logo instanceof MediaAsset ? SiteContent::url($logo) : null,
                'og_image_url' => $ogAsset instanceof MediaAsset ? SiteContent::url($ogAsset) : null,
            ]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'social' => ['nullable', 'array'],
            'social.*.label' => ['required_with:social', 'string', 'max:120'],
            'social.*.url' => ['required_with:social', 'url', 'max:255'],
            'footer_hours' => ['nullable', 'array'],
            'footer_hours.*.day' => ['required_with:footer_hours', 'string', 'max:32'],
            'footer_hours.*.time' => ['required_with:footer_hours', 'string', 'max:64'],
            'logo' => ['nullable', 'image', Rule::dimensions()->minWidth(300)->minHeight(300), 'max:3072', 'mimes:jpg,jpeg,png,webp'],
            'og_image' => ['nullable', 'image', Rule::dimensions()->minWidth(1200)->minHeight(630), 'max:3072', 'mimes:jpg,jpeg,png,webp'],
        ]);

        DB::transaction(function () use ($data, $request) {
            $payload = Arr::only($data, [
                'site_name',
                'tagline',
                'address',
                'phone',
                'whatsapp',
                'email',
                'social',
                'footer_hours',
            ]);

            if ($request->hasFile('logo')) {
                $logo = $this->storeMedia(
                    $request->file('logo'),
                    'logo',
                    'global',
                    $data['site_name'] ?? null
                );

                $payload['logo'] = [
                    'id' => $logo->id,
                    'path' => $logo->path,
                ];
            } else {
                $existingLogo = SiteContent::getMedia('logo', 'global');

                if ($existingLogo instanceof MediaAsset) {
                    $payload['logo'] = [
                        'id' => $existingLogo->id,
                        'path' => $existingLogo->path,
                    ];
                }
            }

            if ($request->hasFile('og_image')) {
                $ogAsset = $this->storeMedia(
                    $request->file('og_image'),
                    'og',
                    'global',
                    'Default OpenGraph'
                );

                $payload['ogImage'] = [
                    'id' => $ogAsset->id,
                    'path' => $ogAsset->path,
                ];
            }

            $this->persistSettings($payload);
        });

        return back()->with('success', 'Pengaturan disimpan');
    }

    private function persistSettings(array $values): void
    {
        if ($values === []) {
            return;
        }

        $now = now();

        $records = collect($values)->map(function ($value, string $key) use ($now) {
            return [
                'section' => 'general',
                'key' => $key,
                'value_json' => json_encode($value),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        })->values()->all();

        DB::table('site_settings')->upsert(
            $records,
            ['section', 'key'],
            ['value_json', 'updated_at']
        );

        foreach (array_keys($values) as $key) {
            SiteContent::forgetSetting('general', $key);
        }
    }
}
