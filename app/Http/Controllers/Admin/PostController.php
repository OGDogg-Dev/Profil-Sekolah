<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\HandlesMediaUpload;
use App\Models\Post;
use App\Models\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    use HandlesMediaUpload;

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $posts = Post::query()
            ->when($search, function ($query, $term) {
                $query->where('title', 'like', "%{$term}%");
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/posts/Index', [
            'posts' => $posts,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $coverFile = $request->file('cover');
        $coverAlt = $data['cover_alt'] ?? null;

        unset($data['cover'], $data['cover_alt']);

        $data['status'] = $this->normaliseStatus($data['status'] ?? null);

        DB::transaction(function () use ($data, $coverFile, $coverAlt) {
            $post = Post::create($data);

            if ($coverFile) {
                $asset = $this->replaceSingleton($coverFile, 'cover', (string) $post->id, $coverAlt);
                $post->update(['cover_url' => $asset->path]);
            }
        });

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Berita berhasil dibuat.');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/Form', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $data = $this->validateData($request, $post->id);
        $coverFile = $request->file('cover');
        $coverAlt = $data['cover_alt'] ?? null;
        $originalSlug = $post->slug;

        unset($data['cover'], $data['cover_alt']);

        $data['status'] = $this->normaliseStatus($data['status'] ?? null);

        DB::transaction(function () use ($post, $data, $coverFile, $coverAlt) {
            $post->update($data);

            if ($coverFile) {
                $asset = $this->replaceSingleton($coverFile, 'cover', (string) $post->id, $coverAlt);
                $post->update(['cover_url' => $asset->path]);
            }
        });

        $this->recordRedirect($originalSlug, $post->slug, '/berita/');

        return redirect()
            ->route('admin.posts.edit', $post)
            ->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Berita dihapus.');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('posts', 'slug')->ignore($id)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
            'status' => ['required', 'string', 'max:32'],
            'cover' => [
                $id ? 'nullable' : 'required',
                'file',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:3072',
                Rule::dimensions()->minWidth(1200)->minHeight(675),
            ],
            'cover_alt' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function recordRedirect(?string $from, ?string $to, string $prefix): void
    {
        if (! $from || ! $to || $from === $to) {
            return;
        }

        Redirect::updateOrCreate(
            ['from' => $prefix . ltrim($from, '/')],
            [
                'to' => $prefix . ltrim($to, '/'),
                'type' => 301,
                'created_at' => now(),
            ]
        );
    }

    private function normaliseStatus(?string $status): string
    {
        return $status === 'published' ? 'published' : 'draft';
    }
}
