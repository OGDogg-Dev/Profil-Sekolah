<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\HandlesMediaUpload;
use App\Models\Event;
use App\Models\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    use HandlesMediaUpload;

    public function index(Request $request): Response
    {
        $events = Event::query()
            ->orderByDesc('start_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/events/Index', [
            'events' => $events,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/events/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $coverFile = $request->file('cover');
        $coverAlt = $data['cover_alt'] ?? null;

        $payload = Arr::only($data, [
            'title',
            'slug',
            'description',
            'start_at',
            'end_at',
            'location',
        ]);

        DB::transaction(function () use ($payload, $coverFile, $coverAlt) {
            $event = Event::create($payload);

            if ($coverFile) {
                $this->replaceSingleton($coverFile, 'cover', (string) $event->id, $coverAlt);
            }
        });

        return redirect()->route('admin.events.index')->with('success', 'Agenda berhasil dibuat.');
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('admin/events/Form', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $data = $this->validateData($request, $event->id);
        $coverFile = $request->file('cover');
        $coverAlt = $data['cover_alt'] ?? null;
        $originalSlug = $event->slug;

        $payload = Arr::only($data, [
            'title',
            'slug',
            'description',
            'start_at',
            'end_at',
            'location',
        ]);

        DB::transaction(function () use ($event, $payload, $coverFile, $coverAlt) {
            $event->update($payload);

            if ($coverFile) {
                $this->replaceSingleton($coverFile, 'cover', (string) $event->id, $coverAlt);
            }
        });

        $this->recordRedirect($originalSlug, $event->slug, '/agenda/');

        return redirect()->route('admin.events.edit', $event)->with('success', 'Agenda diperbarui.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return back()->with('success', 'Agenda dihapus.');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('events', 'slug')->ignore($id)],
            'description' => ['nullable', 'string'],
            'start_at' => ['required', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
            'location' => ['nullable', 'string', 'max:255'],
            'timezone' => ['required', 'string', 'max:64'],
            'recurrence' => ['nullable', 'in:once,weekly,monthly'],
            'registration_url' => ['nullable', 'url', 'max:255'],
            'status' => ['nullable', 'string', 'max:32'],
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
}
