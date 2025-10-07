<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function index(): Response
    {
        $albums = Album::query()
            ->withCount('media')
            ->orderByDesc('created_at')
            ->paginate(12);

        return Inertia::render('gallery/Index', [
            'albums' => $albums,
        ]);
    }

    public function show(string $slug): Response
    {
        $album = Album::query()
            ->with('media')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('gallery/Detail', [
            'album' => $album,
        ]);
    }
}
