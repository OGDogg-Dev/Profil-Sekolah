<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::first();
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
        $settings = SiteSetting::first();
        $album = Album::query()
            ->with('media')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('gallery/Detail', [
            'settings' => $settings,
            'album' => $album,
        ]);
    }
}
