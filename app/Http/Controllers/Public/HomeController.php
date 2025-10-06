<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumMedia;
use App\Models\Event;
use App\Models\Page;
use App\Models\Post;
use App\Models\VocationalProgram;
use App\Support\HomePageDefaults;
use App\Support\SiteContent;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $general = SiteContent::section('general', [
            'site_name' => config('app.name', 'Profil-Sekolah'),
            'tagline' => 'Sekolah inklusif yang mendukung bakat setiap anak.',
            'address' => 'Jl. Rampa Akses 01, Surakarta',
            'phone' => '+62-812-0000-0000',
            'email' => 'halo@sekolahinklusi.sch.id',
            'footer_hours' => "Sen-Jum: 07.00-15.00\nSab: 08.00-12.00\nMin & Libur: Tutup",
        ]);

        $homeConfig = SiteContent::section('home', HomePageDefaults::all());
        $heroMedia = SiteContent::media('hero', 'home');

        $profilePage = Page::where('slug', 'profil')->first(['title', 'content']);
        $profileTitle = $profilePage->title ?? 'Profil';
        $profileContent = $profilePage->content ?? null;
        $profileExcerpt = $profileContent ? Str::limit(strip_tags($profileContent), 250) : null;

        $hero = $this->buildHero($homeConfig, $profileTitle, $profileExcerpt, $heroMedia?->type === 'video');
        if ($heroMedia) {
            $hero['media'] = [
                'src' => Str::startsWith($heroMedia->path, ['http://', 'https://'])
                    ? $heroMedia->path
                    : Storage::disk($heroMedia->disk)->url($heroMedia->path),
                'alt' => $heroMedia->alt,
                'type' => $heroMedia->type,
            ];
        }

        $highlights = $this->buildHighlights($homeConfig);
        $stats = $this->buildStats($homeConfig);
        $testimonials = $this->buildTestimonials($homeConfig);
        $sectionsCopy = $this->buildSectionCopy($homeConfig);
        $layoutOrder = $this->buildLayoutOrder($homeConfig);
        $seo = $this->buildSeo($homeConfig, $general);

        $newsConfig = array_replace_recursive(HomePageDefaults::news(), Arr::get($homeConfig, 'news', []));
        $newsItems = $this->resolveNewsItems($newsConfig);

        $agendaConfig = array_replace_recursive(HomePageDefaults::agenda(), Arr::get($homeConfig, 'agenda', []));
        $agendaItems = $this->resolveAgendaItems($agendaConfig);

        $galleryConfig = array_replace_recursive(HomePageDefaults::gallery(), Arr::get($homeConfig, 'gallery', []));
        $galleryData = $this->resolveGalleryData($galleryConfig);

        $programs = VocationalProgram::query()
            ->with('media')
            ->select('id', 'slug', 'title', 'description', 'duration', 'schedule', 'audience', 'outcomes', 'facilities', 'mentors', 'photos')
            ->get();

        return Inertia::render('public/Home', [
            'settings' => Arr::only($general, ['site_name', 'tagline', 'address', 'phone', 'email', 'footer_hours']),
            'profile' => [
                'title' => $profileTitle,
                'excerpt' => $profileExcerpt,
                'content' => $profileContent,
            ],
            'hero' => $hero,
            'highlights' => $highlights,
            'stats' => $stats,
            'testimonials' => $testimonials,
            'sections' => $sectionsCopy,
            'layout' => $layoutOrder,
            'seo' => $seo,
            'news' => [
                'mode' => $newsConfig['mode'] ?? 'auto',
                'items' => $newsItems,
            ],
            'agenda' => [
                'items' => $agendaItems,
                'showCalendar' => (bool) ($agendaConfig['show_calendar'] ?? true),
            ],
            'gallery' => $galleryData,
            'programs' => $programs,
        ]);
    }

    private function buildHero(array $config, string $fallbackTitle, ?string $fallbackExcerpt, bool $hasVideo = false): array
    {
        $heroDefaults = HomePageDefaults::hero();
        $heroConfig = array_replace_recursive($heroDefaults, Arr::get($config, 'hero', []));

        $title = $heroConfig['title'] ?: $fallbackTitle;
        $description = $heroConfig['description'] ?: ($fallbackExcerpt ?? $heroDefaults['description']);

        return [
            'eyebrow' => $heroConfig['eyebrow'] ?: $heroDefaults['eyebrow'],
            'title' => $title,
            'description' => $description,
            'primary' => [
                'label' => Arr::get($heroConfig, 'primary.label', $heroDefaults['primary']['label']),
                'href' => Arr::get($heroConfig, 'primary.href', $heroDefaults['primary']['href']),
            ],
            'secondary' => [
                'label' => Arr::get($heroConfig, 'secondary.label', $heroDefaults['secondary']['label']),
                'href' => Arr::get($heroConfig, 'secondary.href', $heroDefaults['secondary']['href']),
            ],
            'media' => $hasVideo ? ['type' => 'video'] : ($heroConfig['media'] ?? null),
        ];
    }

    private function buildHighlights(array $config): array
    {
        $defaults = HomePageDefaults::highlights();
        $items = Arr::get($config, 'highlights', $defaults);

        return collect($items)
            ->map(function ($item, $index) use ($defaults) {
                $default = $defaults[$index % count($defaults)] ?? $defaults[0];
                return [
                    'title' => trim((string) ($item['title'] ?? $default['title'])),
                    'description' => $item['description'] ?? $default['description'] ?? null,
                    'href' => $item['href'] ?? $default['href'] ?? null,
                    'icon' => $item['icon'] ?? $default['icon'] ?? 'Sparkles',
                ];
            })
            ->values()
            ->all();
    }

    private function buildStats(array $config): array
    {
        $defaults = HomePageDefaults::stats();
        $items = Arr::get($config, 'stats', $defaults);

        return collect($items)
            ->map(function ($item, $index) use ($defaults) {
                $default = $defaults[$index % count($defaults)] ?? $defaults[0];
                $label = trim((string) ($item['label'] ?? $default['label']));
                $value = trim((string) ($item['value'] ?? $default['value']));

                if ($label === '' || $value === '') {
                    return null;
                }

                return compact('label', 'value');
            })
            ->filter()
            ->values()
            ->all();
    }

    private function buildTestimonials(array $config): array
    {
        $defaults = HomePageDefaults::testimonials();
        $items = Arr::get($config, 'testimonials', $defaults);

        return collect($items)
            ->map(function ($item, $index) use ($defaults) {
                $default = $defaults[$index % count($defaults)] ?? $defaults[0];

                $quote = trim((string) ($item['quote'] ?? $default['quote']));
                $name = trim((string) ($item['name'] ?? $default['name']));
                $role = trim((string) ($item['role'] ?? $default['role'] ?? ''));

                if ($quote === '' || $name === '') {
                    return null;
                }

                return array_filter([
                    'quote' => $quote,
                    'name' => $name,
                    'role' => $role !== '' ? $role : null,
                ]);
            })
            ->filter()
            ->values()
            ->all();
    }

    private function buildSectionCopy(array $config): array
    {
        $defaults = HomePageDefaults::sections();
        $sections = array_replace_recursive($defaults, Arr::get($config, 'sections', []));

        return $sections;
    }

    private function buildLayoutOrder(array $config): array
    {
        $defaults = HomePageDefaults::layout();
        $order = Arr::get($config, 'layout', $defaults);
        $order = is_array($order) ? $order : $defaults;

        return array_values(array_unique(array_merge($order, $defaults)));
    }

    private function buildSeo(array $config, array $general): array
    {
        $defaults = HomePageDefaults::seo();
        $seo = array_replace_recursive($defaults, Arr::get($config, 'seo', []));

        if (empty($seo['title'])) {
            $seo['title'] = ($general['site_name'] ?? 'Profil-Sekolah').' - '.$defaults['title'];
        }

        if (empty($seo['description'])) {
            $seo['description'] = $general['tagline'] ?? $defaults['description'];
        }

        return $seo;
    }

    private function resolveNewsItems(array $config): array
    {
        $mode = $config['mode'] ?? 'auto';
        $limit = (int) Arr::get($config, 'auto.limit', 4);
        $limit = $limit > 0 ? min($limit, 6) : 4;

        if ($mode === 'manual') {
            $ids = collect(Arr::get($config, 'manual.post_ids', []))
                ->map(fn ($id) => (int) $id)
                ->filter(fn ($id) => $id > 0)
                ->unique()
                ->take(4);

            if ($ids->isNotEmpty()) {
                $posts = Post::query()
                    ->whereIn('id', $ids)
                    ->get(['id', 'slug', 'title', 'excerpt', 'cover_url', 'published_at', 'created_at']);

                return $ids
                    ->map(fn ($id) => $posts->firstWhere('id', $id))
                    ->filter()
                    ->map(fn ($post, $index) => $this->mapPostToNewsItem($post, $index === 0))
                    ->values()
                    ->all();
            }
        }

        $posts = Post::query()
            ->published()
            ->orderByDesc('published_at')
            ->take($limit)
            ->get(['slug', 'title', 'excerpt', 'cover_url', 'published_at', 'created_at']);

        return $posts
            ->map(fn ($post, $index) => $this->mapPostToNewsItem($post, $index === 0))
            ->values()
            ->all();
    }

    private function mapPostToNewsItem(Post $post, bool $isHeadline = false): array
    {
        return [
            'slug' => $post->slug,
            'title' => $post->title,
            'href' => route('posts.show', $post->slug),
            'cover' => $this->resolveMediaUrl($post->cover_url),
            'category' => $isHeadline ? 'Sorotan' : 'Berita',
            'publishedAt' => optional($post->published_at ?? $post->created_at)
                ?->timezone(config('app.timezone'))
                ?->translatedFormat('d M Y'),
            'excerpt' => $post->excerpt,
        ];
    }

    private function resolveAgendaItems(array $config): array
    {
        $limit = max(1, (int) ($config['limit'] ?? 4));
        $rangeDays = max(0, (int) ($config['range_days'] ?? 60));

        $query = Event::query()
            ->orderBy('start_at')
            ->take($limit)
            ->select('slug', 'title', 'start_at', 'end_at', 'location');

        $now = Carbon::now();
        $query->where('start_at', '>=', $now);

        if ($rangeDays > 0) {
            $query->where('start_at', '<=', $now->copy()->addDays($rangeDays));
        }

        return $query
            ->get()
            ->map(fn ($event) => [
                'slug' => $event->slug,
                'title' => $event->title,
                'startAt' => $event->start_at?->toIso8601String(),
                'endAt' => $event->end_at?->toIso8601String(),
                'location' => $event->location,
                'href' => route('events.show', $event->slug),
            ])
            ->all();
    }

    private function resolveGalleryData(array $config): array
    {
        $mode = $config['mode'] ?? 'album';
        $limit = max(3, (int) ($config['limit'] ?? 6));

        $albums = collect();
        $mediaItems = collect();

        if ($mode === 'manual') {
            $mediaIds = collect($config['manual_media_ids'] ?? [])
                ->map(fn ($id) => (int) $id)
                ->filter(fn ($id) => $id > 0)
                ->unique()
                ->take(9);

            if ($mediaIds->isNotEmpty()) {
                $media = AlbumMedia::query()
                    ->whereIn('id', $mediaIds)
                    ->get(['id', 'album_id', 'type', 'url', 'caption']);

                $mediaItems = $mediaIds
                    ->map(fn ($id) => $media->firstWhere('id', $id))
                    ->filter()
                    ->map(fn ($item) => [
                        'id' => $item->id,
                        'type' => $item->type,
                        'src' => $item->url,
                        'caption' => $item->caption,
                    ]);
            }
        } else {
            $albumId = Arr::get($config, 'album_id');

            if ($albumId) {
                $selectedAlbum = Album::query()
                    ->with(['media' => fn ($query) => $query->orderBy('sort')->orderBy('id')->take(12)])
                    ->withCount('media')
                    ->find($albumId);

                if ($selectedAlbum) {
                    $albums = collect([$selectedAlbum]);
                    $mediaItems = $selectedAlbum->media
                        ->map(fn ($item) => [
                            'id' => $item->id,
                            'type' => $item->type,
                            'src' => $item->url,
                            'caption' => $item->caption,
                        ]);
                }
            }

            if ($albums->isEmpty()) {
                $albums = Album::query()
                    ->withCount('media')
                    ->orderByDesc('created_at')
                    ->take($limit)
                    ->get();

                if ($albums->isNotEmpty()) {
                    $albumIds = $albums->pluck('id');
                    $mediaLookup = AlbumMedia::query()
                        ->whereIn('album_id', $albumIds)
                        ->orderBy('sort')
                        ->orderBy('id')
                        ->get()
                        ->groupBy('album_id');

                    $mediaItems = $mediaLookup
                        ->flatMap(fn ($items) => $items)
                        ->take($limit * 2)
                        ->map(fn ($item) => [
                            'id' => $item->id,
                            'type' => $item->type,
                            'src' => $item->url,
                            'caption' => $item->caption,
                        ]);
                }
            }
        }

        $albumCards = $albums
            ->take($limit)
            ->map(fn (Album $album) => [
                'slug' => $album->slug,
                'title' => $album->title,
                'href' => route('albums.show', $album->slug),
                'coverUrl' => $album->cover_url,
                'mediaCount' => $album->media_count ?? $album->media_count ?? null,
            ])
            ->values()
            ->all();

        $mediaList = $mediaItems
            ->map(fn ($item) => [
                'id' => $item['id'],
                'type' => $item['type'],
                'src' => $this->resolveMediaUrl($item['src']),
                'caption' => $item['caption'],
            ])
            ->values()
            ->all();

        return [
            'mode' => $mode,
            'albums' => $albumCards,
            'media' => $mediaList,
        ];
    }

    private function resolveMediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return Storage::disk('public')->url(ltrim($path, '/'));
    }
}

