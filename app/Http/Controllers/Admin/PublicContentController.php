<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Models\SiteContentEntry;
use App\Support\SiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicContentController extends Controller
{
    public function edit(): Response
    {
        $homeDefaults = [
            'hero_eyebrow' => 'Sekolah Inklusif - Ramah Disabilitas',
            'hero_title' => 'Setiap Anak Berhak Tumbuh & Berprestasi',
            'hero_description' => 'Lingkungan belajar yang aman, aksesibel, dan menyenangkan dengan dukungan guru pendamping, terapi, serta teknologi asistif.',
            'hero_primary_label' => 'Daftar PPDB',
            'hero_primary_link' => '/ppdb',
            'hero_secondary_label' => 'Hubungi Kami',
            'hero_secondary_link' => '/hubungi-kami',
            'highlights' => [],
            'stats' => [],
            'news_title' => 'Berita Terbaru',
            'news_description' => null,
            'agenda_title' => 'Agenda Terdekat',
            'agenda_description' => null,
            'gallery_title' => 'Galeri / Prestasi',
            'gallery_description' => null,
            'testimonials_title' => 'Suara Mereka',
            'testimonials_items' => [],
        ];

        $heroMedia = SiteContent::media('hero', 'home');

        return Inertia::render('admin/content/Edit', [
            'home' => SiteContent::section('home', $homeDefaults),
            'media' => [
                'home' => [
                    'hero' => $heroMedia ? [
                        'id' => $heroMedia->id,
                        'collection' => $heroMedia->collection,
                        'key' => $heroMedia->key,
                        'url' => $this->mediaUrl($heroMedia),
                        'alt' => $heroMedia->alt,
                        'type' => $heroMedia->type,
                    ] : null,
                ],
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section' => ['required', 'string', 'in:home'],
            'data' => ['required', 'array'],
        ]);

        $data = $this->normalizeHome($validated['data']);

        SiteContentEntry::query()->where('section', 'home')->delete();

        foreach ($data as $key => $value) {
            SiteContentEntry::updateOrCreate(
                ['section' => 'home', 'key' => $key],
                [
                    'type' => is_array($value) ? 'json' : 'text',
                    'value' => is_array($value)
                        ? json_encode($value, JSON_UNESCAPED_UNICODE)
                        : (string) $value,
                ],
            );
        }

        SiteContent::clearCache();

        return back()->with('success', 'Konten beranda berhasil disimpan.');
    }

    public function storeMedia(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'collection' => ['required', 'string', 'in:home'],
            'key' => ['required', 'string', 'in:hero'],
            'file' => ['required', 'image', 'max:5120'],
            'alt' => ['nullable', 'string', 'max:255'],
        ]);

        $existing = MediaAsset::query()
            ->where('collection', $validated['collection'])
            ->where('key', $validated['key'])
            ->first();

        if ($existing) {
            $this->deleteMediaFile($existing);
        }

        $path = $validated['file']->store('public-content/'.$validated['collection'], 'public');

        MediaAsset::updateOrCreate(
            ['collection' => $validated['collection'], 'key' => $validated['key']],
            [
                'disk' => 'public',
                'path' => $path,
                'type' => Str::startsWith($validated['file']->getMimeType(), 'video/') ? 'video' : 'image',
                'alt' => $validated['alt'] ?? null,
            ],
        );

        SiteContent::clearCache();

        return back()->with('success', 'Media hero diperbarui.');
    }

    public function destroyMedia(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'collection' => ['required', 'string', 'in:home'],
            'key' => ['required', 'string', 'in:hero'],
        ]);

        $media = MediaAsset::query()
            ->where('collection', $validated['collection'])
            ->where('key', $validated['key'])
            ->first();

        if ($media) {
            $this->deleteMediaFile($media);
            $media->delete();
        }

        SiteContent::clearCache();

        return back()->with('success', 'Media hero dihapus.');
    }

    private function normalizeHome(array $data): array
    {
        return [
            'hero_eyebrow' => trim((string) ($data['hero_eyebrow'] ?? '')),
            'hero_title' => trim((string) ($data['hero_title'] ?? '')),
            'hero_description' => trim((string) ($data['hero_description'] ?? '')),
            'hero_primary_label' => trim((string) ($data['hero_primary_label'] ?? '')),
            'hero_primary_link' => trim((string) ($data['hero_primary_link'] ?? '')),
            'hero_secondary_label' => trim((string) ($data['hero_secondary_label'] ?? '')),
            'hero_secondary_link' => trim((string) ($data['hero_secondary_link'] ?? '')),
            'highlights' => collect($data['highlights'] ?? [])
                ->map(fn (array $item) => [
                    'title' => trim((string) ($item['title'] ?? '')),
                    'description' => trim((string) ($item['description'] ?? '')),
                    'href' => trim((string) ($item['href'] ?? '')),
                ])
                ->filter(fn ($item) => $item['title'] !== '' || $item['description'] !== '')
                ->values()
                ->all(),
            'stats' => collect($data['stats'] ?? [])
                ->map(fn (array $item) => [
                    'label' => trim((string) ($item['label'] ?? '')),
                    'value' => trim((string) ($item['value'] ?? '')),
                ])
                ->filter(fn ($item) => $item['label'] !== '' && $item['value'] !== '')
                ->values()
                ->all(),
            'news_title' => trim((string) ($data['news_title'] ?? '')),
            'news_description' => trim((string) ($data['news_description'] ?? '')),
            'agenda_title' => trim((string) ($data['agenda_title'] ?? '')),
            'agenda_description' => trim((string) ($data['agenda_description'] ?? '')),
            'gallery_title' => trim((string) ($data['gallery_title'] ?? '')),
            'gallery_description' => trim((string) ($data['gallery_description'] ?? '')),
            'testimonials_title' => trim((string) ($data['testimonials_title'] ?? '')),
            'testimonials_items' => collect($data['testimonials_items'] ?? [])
                ->map(fn (array $item) => [
                    'quote' => trim((string) ($item['quote'] ?? '')),
                    'name' => trim((string) ($item['name'] ?? '')),
                    'role' => trim((string) ($item['role'] ?? '')),
                ])
                ->filter(fn ($item) => $item['quote'] !== '' && $item['name'] !== '')
                ->values()
                ->all(),
        ];
    }

    private function mediaUrl(MediaAsset $media): string
    {
        if (Str::startsWith($media->path, ['http://', 'https://'])) {
            return $media->path;
        }

        return Storage::disk($media->disk)->url($media->path);
    }

    private function deleteMediaFile(MediaAsset $media): void
    {
        if ($media->path && ! Str::startsWith($media->path, ['http://', 'https://'])) {
            Storage::disk($media->disk)->delete($media->path);
        }
    }
}
