<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumMedia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function index(): Response
    {
        $albums = Album::query()
            ->withCount('media')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('admin/albums/Index', [
            'albums' => $albums,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/albums/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $payload = Arr::except($data, ['cover', 'remove_cover']);

        $album = new Album($payload);

        if ($request->hasFile('cover')) {
            $album->cover_url = $this->storeCover($request->file('cover'));
        }

        $album->save();

        return redirect()->route('admin.albums.edit', $album)->with('success', 'Album berhasil dibuat.');
    }

    public function edit(Album $album): Response
    {
        $album->load('media');

        return Inertia::render('admin/albums/Form', [
            'album' => $album,
        ]);
    }

    public function update(Request $request, Album $album): RedirectResponse
    {
        $data = $this->validateData($request, $album->id);
        $payload = Arr::except($data, ['cover', 'remove_cover']);

        if ($request->boolean('remove_cover')) {
            $this->deleteStoredCover($album);
            $album->cover_url = null;
        }

        if ($request->hasFile('cover')) {
            $this->deleteStoredCover($album);
            $album->cover_url = $this->storeCover($request->file('cover'));
        }

        $album->fill($payload);
        $album->save();

        return redirect()->route('admin.albums.edit', $album)->with('success', 'Album diperbarui.');
    }

    public function destroy(Album $album): RedirectResponse
    {
        $album->load('media');

        $this->deleteStoredCover($album);

        $album->media->each(function (AlbumMedia $media): void {
            $this->deleteStoredMedia($media);
            $media->delete();
        });

        $album->delete();

        return back()->with('success', 'Album dihapus.');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('albums', 'slug')->ignore($id)],
            'description' => ['nullable', 'string'],
            'cover' => ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp'],
            'remove_cover' => ['sometimes', 'boolean'],
        ]);
    }

    private function storeCover(UploadedFile $file): string
    {
        $directory = 'albums/covers/' . now()->format('Y/m');
        $filename = Str::uuid()->toString() . '.' . strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'jpg');

        Storage::disk('public')->putFileAs($directory, $file, $filename);

        return $directory . '/' . $filename;
    }

    private function deleteStoredCover(Album $album): void
    {
        $path = $album->getRawOriginal('cover_url');

        if (! $path || Str::startsWith($path, ['http://', 'https://', '/'])) {
            return;
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
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
