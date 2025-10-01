<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Event;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\VocationalProgram;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::first();

        $profilePage = Page::query()->where('slug', 'profil')->first(['title', 'content']);
        $profileExcerpt = $profilePage ? Str::limit(strip_tags($profilePage->content), 250) : null;

        $programs = VocationalProgram::query()
            ->select('slug', 'title', 'description', 'duration', 'schedule')
            ->take(6)
            ->get();

        $posts = Post::query()
            ->published()
            ->orderByDesc('published_at')
            ->take(3)
            ->get(['slug', 'title', 'excerpt', 'cover_url', 'published_at']);

        $events = Event::query()
            ->orderBy('start_at')
            ->take(3)
            ->get(['slug', 'title', 'start_at', 'end_at', 'location', 'description']);

        $albums = Album::query()
            ->withCount('media')
            ->with(['media' => function ($query) {
                $query->orderBy('sort')->orderBy('id')->take(3);
            }])
            ->orderByDesc('created_at')
            ->take(3)
            ->get(['id', 'slug', 'title', 'cover_url', 'description']);

        return Inertia::render('public/Home', [
            'settings' => $settings,
            'profile' => [
                'title' => $profilePage->title ?? 'Profil',
                'excerpt' => $profileExcerpt,
            ],
            'programs' => $programs,
            'posts' => $posts,
            'events' => $events,
            'albums' => $albums,
        ]);
    }
}
