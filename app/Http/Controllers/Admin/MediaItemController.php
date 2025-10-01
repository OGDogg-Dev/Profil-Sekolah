<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MediaItemController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'vocational_program_id' => ['nullable', 'exists:vocational_programs,id'],
            'type' => ['required', 'in:image,video'],
            'url' => ['required', 'string'],
            'poster' => ['nullable', 'string'],
            'alt' => ['nullable', 'string'],
            'caption' => ['nullable', 'string'],
            'track_vtt' => ['nullable', 'string'],
        ]);

        MediaItem::create($data);

        return back()->with('success', 'Media ditambahkan');
    }

    public function destroy(MediaItem $media): RedirectResponse
    {
        $media->delete();

        return back();
    }
}
