<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        $album = Album::create($data);

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

        $album->update($data);

        return redirect()->route('admin.albums.edit', $album)->with('success', 'Album diperbarui.');
    }

    public function destroy(Album $album): RedirectResponse
    {
        $album->delete();

        return back()->with('success', 'Album dihapus.');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('albums', 'slug')->ignore($id)],
            'cover_url' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
        ]);
    }
}
