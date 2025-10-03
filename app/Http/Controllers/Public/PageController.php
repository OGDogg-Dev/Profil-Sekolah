<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function showProfile(): Response
    {
        $settings = SiteSetting::first();
        $page = Page::where('slug', 'profil')->first();

        return Inertia::render('public/Profile', [
            'settings' => $settings,
            'page' => $page,
        ]);
    }

    public function showVisionMission(): Response
    {
        $settings = SiteSetting::first();
        $page = Page::where('slug', 'visi-misi')->first();

        $vision = null;
        $missions = [];

        if ($page) {
            $content = strip_tags($page->content, '<h1><h2><h3><h4><p><li>');
            $sections = preg_split('/<h3>/', $content);
            foreach ($sections as $section) {
                if (str_starts_with($section, 'Visi')) {
                    $vision = trim(strip_tags(Str::after($section, '</h3>')));
                }
                if (str_starts_with($section, 'Misi')) {
                    preg_match_all('/<li>(.*?)<\/li>/', $section, $matches);
                    if (!empty($matches[1])) {
                        $missions = array_map(fn ($item) => trim(strip_tags($item)), $matches[1]);
                    }
                }
            }
        }

        return Inertia::render('public/VisionMission', [
            'settings' => $settings,
            'page' => $page,
            'vision' => $vision,
            'missions' => $missions,
        ]);
    }
}
