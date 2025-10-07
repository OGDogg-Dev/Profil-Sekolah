<?php

namespace App\Http\Controllers\Public;

use App\Facades\SiteContent;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = $this->generalSettings();
        $posts = Post::query()
            ->published()
            ->orderByDesc('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('news/Index', [
            'settings' => $settings,
            'posts' => $posts,
        ]);
    }

    public function show(string $slug): Response
    {
        $settings = $this->generalSettings();
        $post = Post::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Post::query()
            ->published()
            ->where('id', '<>', $post->id)
            ->latest('published_at')
            ->take(3)
            ->get(['slug', 'title', 'published_at']);

        return Inertia::render('news/Detail', [
            'settings' => $settings,
            'post' => $post,
            'related' => $related,
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
