<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Models\Redirect;
use App\Models\VocationalProgram;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VocationalProgramController extends Controller
{
    public function index(): Response
    {
        $items = VocationalProgram::select('id', 'slug', 'title', 'schedule', 'photos')->get();

        return Inertia::render('admin/voc/Index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/voc/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        \Log::info('Store method called', [
            'has_files' => $request->hasFile('photos'),
            'files_count' => $request->hasFile('photos') ? count($request->file('photos')) : 0,
            'all_data' => $request->all(),
        ]);

        $data = $request->validate([
            'slug' => ['required', 'alpha_dash', 'unique:vocational_programs,slug'],
            'title' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable'],
            'audience' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:255'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'outcomes' => ['nullable', 'array'],
            'facilities' => ['nullable', 'array'],
            'mentors' => ['nullable', 'array'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['file', 'max:5120', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4'],
        ]);

        $program = VocationalProgram::create($data);

        if ($request->hasFile('photos')) {
            \Log::info('Processing files', ['count' => count($request->file('photos'))]);
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('vocational-photos', 'public');
                \Log::info('File stored', ['path' => $path]);
                MediaItem::create([
                    'vocational_program_id' => $program->id,
                    'type' => 'image',
                    'url' => $path,
                    'alt' => $data['title'],
                ]);
            }
        }

        return redirect()->route('admin.vocational-programs.index');
    }

    public function edit(VocationalProgram $vocational_program): Response
    {
        $vocational_program->load('media');

        return Inertia::render('admin/voc/Form', [
            'item' => $vocational_program,
        ]);
    }

    public function update(Request $request, VocationalProgram $vocational_program): RedirectResponse
    {
        \Log::info('Update method called', [
            'program_id' => $vocational_program->id,
            'has_files' => $request->hasFile('photos'),
            'files_count' => $request->hasFile('photos') ? count($request->file('photos')) : 0,
            'all_data' => $request->all(),
        ]);

        $data = $request->validate([
            'slug' => ['required', 'alpha_dash', 'unique:vocational_programs,slug,' . $vocational_program->id],
            'title' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable'],
            'audience' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:255'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'outcomes' => ['nullable', 'array'],
            'facilities' => ['nullable', 'array'],
            'mentors' => ['nullable', 'array'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['file', 'max:5120', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4'],
        ]);

        $originalSlug = $vocational_program->slug;

        if ($request->hasFile('photos')) {
            \Log::info('Processing files in update', ['count' => count($request->file('photos'))]);
            // Create new media items (don't delete existing ones, user can delete individually)
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('vocational-photos', 'public');
                \Log::info('File stored in update', ['path' => $path]);
                MediaItem::create([
                    'vocational_program_id' => $vocational_program->id,
                    'type' => 'image',
                    'url' => $path,
                    'alt' => $data['title'],
                ]);
            }
        }

        $vocational_program->update($data);

        $this->recordRedirect($originalSlug, $vocational_program->slug, '/vokasional/');

        return back()->with('success', 'Program diperbarui');
    }

    public function destroy(VocationalProgram $vocational_program): RedirectResponse
    {
        // Delete associated media items
        $vocational_program->media()->delete();

        $vocational_program->delete();

        return back();
    }

    public function deleteMedia(VocationalProgram $vocational_program, MediaItem $media): RedirectResponse
    {
        // Ensure the media belongs to the program
        if ($media->vocational_program_id !== $vocational_program->id) {
            abort(403);
        }

        // Delete the file from storage
        Storage::disk('public')->delete($media->url);

        // Delete the media record
        $media->delete();

        return back()->with('success', 'Media berhasil dihapus');
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

