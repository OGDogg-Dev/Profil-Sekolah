<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumMedia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AlbumMediaController extends Controller
{
    public function store(Request $request, Album $album): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:image,video'],
            'url' => ['required', 'string', 'max:2048'],
            'caption' => ['nullable', 'string', 'max:500'],
            'poster' => ['nullable', 'string', 'max:2048'],
            'track_vtt' => ['nullable', 'string', 'max:2048'],
            'sort' => ['nullable', 'integer', 'min:0'],
        ]);

        $album->media()->create($data);

        return back()->with('success', 'Media berhasil ditambahkan.');
    }

    public function destroy(Album $album, AlbumMedia $media): RedirectResponse
    {
        abort_unless($media->album_id === $album->id, 404);

        $media->delete();

        return back()->with('success', 'Media dihapus.');
    }
}
