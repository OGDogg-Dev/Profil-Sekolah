<?php

namespace App\Http\Controllers\Public;

use App\Facades\SiteContent;
use App\Http\Controllers\Controller;
use App\Models\VocationalProgram;
use Inertia\Inertia;
use Inertia\Response;

class VocationalController extends Controller
{
    public function index(): Response
    {
        $settings = $this->generalSettings();
        $items = VocationalProgram::with('media')
            ->select('id', 'slug', 'title', 'description', 'duration', 'schedule')
            ->get();

        return Inertia::render('vocational/Index', [
            'settings' => $settings,
            'items' => $items,
        ]);
    }

    public function show(string $slug): Response
    {
        $settings = $this->generalSettings();
        $program = VocationalProgram::with('media')
            ->select('id', 'slug', 'title', 'icon', 'description', 'audience', 'duration', 'schedule', 'outcomes', 'facilities', 'mentors', 'photos')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('vocational/Detail', [
            'settings' => $settings,
            'program' => $program,
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
