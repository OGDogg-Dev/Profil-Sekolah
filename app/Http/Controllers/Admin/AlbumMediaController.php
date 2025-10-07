<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumMedia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AlbumMediaController extends Controller
{
    public function store(Request $request, Album $album): RedirectResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4'],
            'caption' => ['nullable', 'string', 'max:500'],
            'sort' => ['nullable', 'integer', 'min:0'],
        ]);

        $file = $request->file('file');
        $path = $this->storeMediaFile($file);
        $mime = (string) $file->getMimeType();

        $album->media()->create([
            'type' => str_starts_with($mime, 'video/') ? 'video' : 'image',
            'url' => $path,
            'caption' => isset($data['caption']) ? trim($data['caption']) : null,
            'sort' => isset($data['sort']) ? (int) $data['sort'] : 0,
        ]);

        return back()->with('success', 'Media berhasil ditambahkan.');
    }

    public function destroy(Album $album, AlbumMedia $media): RedirectResponse
    {
        abort_unless($media->album_id === $album->id, 404);

        $this->deleteStoredMedia($media);
        $media->delete();

        return back()->with('success', 'Media dihapus.');
    }

    private function storeMediaFile(UploadedFile $file): string
    {
        $segment = str_starts_with((string) $file->getMimeType(), 'video/') ? 'videos' : 'images';
        $directory = sprintf('albums/%s/%s', $segment, now()->format('Y/m'));
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin');

        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        $filename = Str::uuid()->toString() . '.' . $extension;

        Storage::disk('public')->putFileAs($directory, $file, $filename);

        return $directory . '/' . $filename;
    }

    private function deleteStoredMedia(AlbumMedia $media): void
    {
        $path = $media->getRawOriginal('url');

        if (! $path || Str::startsWith($path, ['http://', 'https://', '/'])) {
            return;
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
