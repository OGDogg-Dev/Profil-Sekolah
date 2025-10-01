<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
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

        Event::create($data);

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

        $event->update($data);

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
        ]);
    }
}
