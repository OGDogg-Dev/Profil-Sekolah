<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->string('filter')->toString();

        $query = Event::query()->orderBy('start_at');

        if ($filter === 'past') {
            $query->where('start_at', '<', now());
        } else {
            $query->where('start_at', '>=', now());
        }

        $events = $query->paginate(12)->withQueryString();

        return Inertia::render('agenda/Index', [
            'events' => $events,
            'filters' => [
                'filter' => $filter ?: 'upcoming',
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $event = Event::query()->where('slug', $slug)->firstOrFail();

        return Inertia::render('agenda/Detail', [
            'event' => $event,
        ]);
    }

    public function ics(string $slug): HttpResponse
    {
        $event = Event::query()->where('slug', $slug)->firstOrFail();

        $start = $event->start_at instanceof Carbon ? $event->start_at : Carbon::parse($event->start_at);
        $end = $event->end_at instanceof Carbon ? $event->end_at : null;

        if (! $end) {
            $end = $start->copy()->addHour();
        }

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Profil Sekolah//ID',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            'UID:event-' . $event->id . '@profil-sekolah',
            'SUMMARY:' . $this->escapeIcsText($event->title),
            'DTSTART:' . $this->formatIcsDate($start),
            'DTEND:' . $this->formatIcsDate($end),
            'DTSTAMP:' . $this->formatIcsDate($event->created_at instanceof Carbon ? $event->created_at : Carbon::now()),
            'DESCRIPTION:' . $this->escapeIcsText((string) $event->description),
            'LOCATION:' . $this->escapeIcsText((string) $event->location),
            'URL:' . url(route('events.show', ['slug' => $event->slug], false)),
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        $content = implode("\r\n", $lines) . "\r\n";

        return response($content, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $event->slug . '.ics"',
        ]);
    }

    private function formatIcsDate(Carbon $value): string
    {
        return $value->copy()->timezone('UTC')->format('Ymd\THis\Z');
    }

    private function escapeIcsText(?string $text): string
    {
        $text = $text ?? '';

        return addcslashes(str_replace(["\r\n", "\n"], '\\n', $text), ",;");
    }
}
