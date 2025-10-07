<?php

namespace App\Http\Controllers\Public;

use App\Facades\SiteContent;
use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = $this->generalSettings();
        $filter = $request->string('filter')->toString();

        $query = Event::query()->orderBy('start_at');

        if ($filter === 'past') {
            $query->where('start_at', '<', now());
        } else {
            $query->where('start_at', '>=', now());
        }

        $events = $query->paginate(12)->withQueryString();

        return Inertia::render('agenda/Index', [
            'settings' => $settings,
            'events' => $events,
            'filters' => [
                'filter' => $filter ?: 'upcoming',
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $settings = $this->generalSettings();
        $event = Event::query()->where('slug', $slug)->firstOrFail();

        return Inertia::render('agenda/Detail', [
            'settings' => $settings,
            'event' => $event,
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
