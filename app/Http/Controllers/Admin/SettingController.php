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
            $default = in_array($key, ['social', 'footer_hours'], true) ? [] : null;

            return [$key => SiteContent::getSetting('general', $key, $default)];
        })->all();

        $settings['social'] = $this->normaliseSocial($settings['social'] ?? []);
        $settings['footer_hours'] = $this->normaliseFooterHours($settings['footer_hours'] ?? []);

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
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp'],
            'og_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp'],
            'remove_logo' => ['sometimes', 'boolean'],
            'remove_og_image' => ['sometimes', 'boolean'],
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
                $logo = $this->replaceSingleton(
                    $request->file('logo'),
                    'logo',
                    'global',
                    $data['site_name'] ?? null
                );

                $payload['logo'] = [
                    'id' => $logo->id,
                    'path' => $logo->path,
                ];
            } elseif ($request->boolean('remove_logo')) {
                $this->deleteByKey('logo', 'global');
                $payload['logo'] = null;
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
                $ogAsset = $this->replaceSingleton(
                    $request->file('og_image'),
                    'og',
                    'global',
                    'Default OpenGraph'
                );

                $payload['ogImage'] = [
                    'id' => $ogAsset->id,
                    'path' => $ogAsset->path,
                ];
            } elseif ($request->boolean('remove_og_image')) {
                $this->deleteByKey('og', 'global');
                $payload['ogImage'] = null;
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

    /**
     * @param  mixed  $value
     * @return array<int, array{label: string, url: string}>
     */
    private function normaliseSocial(mixed $value): array
    {
        $items = [];

        if (is_array($value)) {
            if (array_is_list($value)) {
                foreach ($value as $entry) {
                    if (! is_array($entry)) {
                        continue;
                    }

                    $label = isset($entry['label']) && is_string($entry['label']) ? trim($entry['label']) : '';
                    $url = isset($entry['url']) && is_string($entry['url']) ? trim($entry['url']) : '';

                    if ($label !== '' || $url !== '') {
                        $items[] = ['label' => $label, 'url' => $url];
                    }
                }
            } else {
                foreach ($value as $label => $url) {
                    $labelString = is_string($label) ? trim($label) : '';
                    $urlString = is_string($url) ? trim($url) : '';

                    if ($labelString !== '' || $urlString !== '') {
                        $items[] = ['label' => $labelString, 'url' => $urlString];
                    }
                }
            }
        }

        if ($items === []) {
            return [['label' => '', 'url' => '']];
        }

        return $items;
    }

    /**
     * @param  mixed  $value
     * @return array<int, array{day: string, time: string}>
     */
    private function normaliseFooterHours(mixed $value): array
    {
        $items = [];

        if (is_array($value)) {
            if (array_is_list($value)) {
                foreach ($value as $entry) {
                    if (! is_array($entry)) {
                        continue;
                    }

                    $day = isset($entry['day']) && is_string($entry['day'])
                        ? trim($entry['day'])
                        : (isset($entry['label']) && is_string($entry['label']) ? trim($entry['label']) : '');

                    $time = isset($entry['time']) && is_string($entry['time']) ? trim($entry['time']) : '';

                    if ($time === '') {
                        $open = isset($entry['open']) && is_string($entry['open']) ? trim($entry['open']) : '';
                        $close = isset($entry['close']) && is_string($entry['close']) ? trim($entry['close']) : '';
                        $time = trim(implode(' - ', array_filter([$open, $close])));
                    }

                    if ($time === '' && isset($entry['value']) && is_string($entry['value'])) {
                        $time = trim($entry['value']);
                    }

                    if ($day !== '' || $time !== '') {
                        $items[] = ['day' => $day, 'time' => $time];
                    }
                }
            } else {
                foreach ($value as $day => $time) {
                    $dayString = is_string($day) ? trim($day) : '';
                    $timeString = is_string($time) ? trim($time) : '';

                    if ($dayString !== '' || $timeString !== '') {
                        $items[] = ['day' => $dayString, 'time' => $timeString];
                    }
                }
            }
        }

        if ($items === []) {
            return [['day' => '', 'time' => '']];
        }

        return $items;
    }
}
