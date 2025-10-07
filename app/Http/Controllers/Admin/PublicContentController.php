<?php

namespace App\Http\Controllers\Admin;

use App\Facades\SiteContent;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\HandlesMediaUpload;
use App\Models\Album;
use App\Models\MediaAsset;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PublicContentController extends Controller
{
    use HandlesMediaUpload;

    private const SUPPORTED_SECTIONS = ['home', 'profil', 'visi'];

    public function edit(string $section): Response
    {
        $section = $this->normaliseSection($section);

        $settings = $this->resolveSettings($section);
        $heroAsset = SiteContent::getMedia('hero', $section);

        return Inertia::render('admin/content/Edit', [
            'section' => $section,
            'settings' => $settings,
            'hero_url' => $heroAsset instanceof MediaAsset ? SiteContent::url($heroAsset) : null,
            'updateUrl' => route('admin.content.update', ['section' => $section]),
            'availableNews' => Post::query()
                ->select(['id', 'title'])
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->limit(24)
                ->get(),
            'galleryAlbums' => Album::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(Request $request, string $section): RedirectResponse
    {
        $section = $this->normaliseSection($section);

        $validated = $request->validate([
            'hero' => ['nullable', 'array'],
            'hero.title' => ['nullable', 'string', 'max:255'],
            'hero.subtitle' => ['nullable', 'string'],
            'hero.cta1_label' => ['nullable', 'string', 'max:120'],
            'hero.cta1_url' => ['nullable', 'string', 'max:255'],
            'hero.cta2_label' => ['nullable', 'string', 'max:120'],
            'hero.cta2_url' => ['nullable', 'string', 'max:255'],
            'hero.overlay' => ['nullable', 'integer', 'between:0,100'],
            'hero_alt' => ['nullable', 'string', 'max:255'],
            'hero_remove' => ['sometimes', 'boolean'],
            'hero_media' => [
                'nullable',
                'file',
                'mimetypes:image/jpeg,image/png,image/webp',
                Rule::dimensions()->minWidth(1600)->minHeight(900),
            ],
            'showHighlights' => ['sometimes', 'boolean'],
            'highlights' => ['nullable', 'array', 'max:4'],
            'highlights.*.icon' => ['nullable', 'string', 'max:120'],
            'highlights.*.title' => ['nullable', 'string', 'max:120'],
            'highlights.*.description' => ['nullable', 'string'],
            'highlights.*.link' => ['nullable', 'string', 'max:255'],
            'newsMode' => ['nullable', Rule::in(['auto', 'manual'])],
            'pins' => ['nullable', 'array'],
            'pins.*' => ['integer', 'exists:posts,id'],
            'agendaLimit' => ['nullable', 'integer', 'min:1', 'max:12'],
            'galleryMode' => ['nullable', Rule::in(['album', 'manual'])],
            'galleryAlbumId' => ['nullable', 'integer', 'exists:albums,id'],
            'galleryManual' => ['nullable', 'array'],
            'galleryManual.*' => ['integer'],
            'stats' => ['nullable', 'array'],
            'stats.students' => ['nullable', 'integer', 'min:0'],
            'stats.teachers' => ['nullable', 'integer', 'min:0'],
            'stats.accreditation' => ['nullable', 'string', 'max:120'],
            'stats.photos' => ['nullable', 'integer', 'min:0'],
            'showStats' => ['sometimes', 'boolean'],
            'testimonials' => ['nullable', 'array'],
            'testimonials.*.name' => ['nullable', 'string', 'max:120'],
            'testimonials.*.role' => ['nullable', 'string', 'max:120'],
            'testimonials.*.quote' => ['nullable', 'string'],
            'showTestimonials' => ['sometimes', 'boolean'],
        ]);

        $heroAlt = trim((string) ($validated['hero_alt'] ?? ''));
        $existingHero = SiteContent::getMedia('hero', $section);
        $heroAsset = $existingHero instanceof MediaAsset ? $existingHero : null;

        if ($request->boolean('hero_remove') && $heroAsset instanceof MediaAsset) {
            $this->deleteMedia($heroAsset);
            $heroAsset = null;
            $heroAlt = '';
        }

        if ($request->hasFile('hero_media')) {
            $heroAsset = $this->replaceSingleton(
                $request->file('hero_media'),
                'hero',
                $section,
                $heroAlt !== '' ? $heroAlt : null
            );
            $heroAlt = $heroAlt !== '' ? $heroAlt : ($heroAsset->alt ?? '');
        } elseif ($heroAsset instanceof MediaAsset) {
            $heroAsset->update(['alt' => $heroAlt !== '' ? $heroAlt : null]);
        }

        $heroSettings = array_merge([
            'title' => null,
            'subtitle' => null,
            'cta1_label' => null,
            'cta1_url' => null,
            'cta2_label' => null,
            'cta2_url' => null,
            'overlay' => 60,
        ], $validated['hero'] ?? []);

        $heroSettings['overlay'] = (int) ($heroSettings['overlay'] ?? 60);
        $heroSettings['alt'] = $heroAlt !== '' ? $heroAlt : null;
        $heroSettings['asset_id'] = $heroAsset?->id;

        $highlights = collect($validated['highlights'] ?? [])
            ->map(fn ($item) => [
                'icon' => Arr::get($item, 'icon'),
                'title' => Arr::get($item, 'title'),
                'description' => Arr::get($item, 'description'),
                'link' => Arr::get($item, 'link'),
            ])
            ->values()
            ->all();

        $pins = collect($validated['pins'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->all();

        $galleryManual = collect($validated['galleryManual'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->all();

        $stats = array_filter([
            'students' => Arr::get($validated, 'stats.students'),
            'teachers' => Arr::get($validated, 'stats.teachers'),
            'accreditation' => Arr::get($validated, 'stats.accreditation'),
            'photos' => Arr::get($validated, 'stats.photos'),
        ], fn ($value) => $value !== null && $value !== '');

        $testimonials = collect($validated['testimonials'] ?? [])
            ->map(fn ($item) => [
                'name' => Arr::get($item, 'name'),
                'role' => Arr::get($item, 'role'),
                'quote' => Arr::get($item, 'quote'),
            ])
            ->values()
            ->all();

        $values = array_filter([
            'hero' => $heroSettings,
            'showHighlights' => $request->boolean('showHighlights'),
            'highlights' => $highlights,
            'newsMode' => $validated['newsMode'] ?? 'auto',
            'pins' => $pins,
            'agendaLimit' => $validated['agendaLimit'] ?? 3,
            'galleryMode' => $validated['galleryMode'] ?? 'album',
            'galleryAlbumId' => $validated['galleryAlbumId'] ?? null,
            'galleryManual' => $galleryManual,
            'stats' => $stats,
            'showStats' => $request->boolean('showStats'),
            'testimonials' => $testimonials,
            'showTestimonials' => $request->boolean('showTestimonials'),
        ], fn ($value) => $value !== null);

        $this->persistSection($section, $values);

        return back()->with('success', 'Konten berhasil disimpan.');
    }

    private function resolveSettings(string $section): array
    {
        $sectionKey = $this->sectionKey($section);

        $keys = [
            'hero',
            'showHighlights',
            'highlights',
            'newsMode',
            'pins',
            'agendaLimit',
            'galleryMode',
            'galleryAlbumId',
            'galleryManual',
            'stats',
            'showStats',
            'testimonials',
            'showTestimonials',
        ];

        $settings = collect($keys)
            ->mapWithKeys(fn (string $key) => [$key => SiteContent::getSetting($sectionKey, $key)])
            ->toArray();

        if (! is_array($settings['hero'] ?? null)) {
            $settings['hero'] = [];
        }

        if (
            (! isset($settings['hero']['alt']) || $settings['hero']['alt'] === null)
            && ($heroAsset = SiteContent::getMedia('hero', $section)) instanceof MediaAsset
        ) {
            $settings['hero']['alt'] = $heroAsset->alt;
        }

        return $settings;
    }

    private function persistSection(string $section, array $values): void
    {
        if ($values === []) {
            return;
        }

        $sectionKey = $this->sectionKey($section);
        $now = now();

        $records = collect($values)
            ->map(function ($value, string $key) use ($sectionKey, $now) {
                return [
                    'section' => $sectionKey,
                    'key' => $key,
                    'value_json' => json_encode($value),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            })
            ->values()
            ->all();

        DB::table('site_settings')->upsert($records, ['section', 'key'], ['value_json', 'updated_at']);

        foreach (array_keys($values) as $key) {
            SiteContent::forgetSetting($sectionKey, $key);
        }
    }

    private function normaliseSection(string $section): string
    {
        $section = strtolower($section);

        abort_unless(in_array($section, self::SUPPORTED_SECTIONS, true), 404);

        return $section;
    }

    private function sectionKey(string $section): string
    {
        return 'content_' . $section;
    }
}

