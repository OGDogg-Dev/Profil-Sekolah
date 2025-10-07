<?php

namespace App\Http\Controllers\Public;

use App\Facades\SiteContent;
use App\Http\Controllers\Controller;
use App\Models\Album;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function index(): Response
    {
        $settings = $this->generalSettings();
        $albums = Album::query()
            ->withCount('media')
            ->orderByDesc('created_at')
            ->paginate(12);

        return Inertia::render('gallery/Index', [
            'settings' => $settings,
            'albums' => $albums,
        ]);
    }

    public function show(string $slug): Response
    {
        $settings = $this->generalSettings();
        $album = Album::query()
            ->with('media')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('gallery/Detail', [
            'settings' => $settings,
            'album' => $album,
        ]);
    }

    private function generalSettings(): array
    {
        return [
            'site_name' => SiteContent::getSetting('general', 'site_name'),
            'tagline' => SiteContent::getSetting('general', 'tagline'),
        ];
    }
}
