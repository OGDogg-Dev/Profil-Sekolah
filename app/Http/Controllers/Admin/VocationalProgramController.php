<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Models\Redirect;
use App\Models\VocationalProgram;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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
        $data = $this->validateData($request);
        $coverFile = $request->file('cover');
        $galleryFiles = $this->normaliseUploadedFiles($request->file('gallery'));
        $galleryAlt = $this->normaliseAltValues($request->input('gallery_alt', []));

        DB::transaction(function () use ($request, $data, $coverFile, $galleryFiles, $galleryAlt) {
            $program = VocationalProgram::create($this->programPayload($request, $data));

            if ($coverFile instanceof UploadedFile) {
                $this->storeCoverMedia($program, $coverFile, $this->normaliseText($data['cover_alt'] ?? null));
            }

            if ($galleryFiles !== []) {
                $this->storeGalleryMedia($program, $galleryFiles, $galleryAlt);
            }

            $this->refreshPhotosColumn($program);
        });

        return redirect()
            ->route('admin.vocational-programs.index')
            ->with('success', 'Program berhasil dibuat');
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
        $data = $this->validateData($request, $vocational_program->id);
        $coverFile = $request->file('cover');
        $galleryFiles = $this->normaliseUploadedFiles($request->file('gallery'));
        $galleryAlt = $this->normaliseAltValues($request->input('gallery_alt', []));
        $originalSlug = $vocational_program->slug;
        $coverAlt = $this->normaliseText($data['cover_alt'] ?? null);
        $altProvided = $request->has('cover_alt');

        DB::transaction(function () use ($request, $vocational_program, $data, $coverFile, $galleryFiles, $galleryAlt, $coverAlt, $altProvided) {
            $vocational_program->update($this->programPayload($request, $data));

            if ($request->boolean('remove_cover')) {
                $this->deleteExistingCover($vocational_program);
            }

            if ($coverFile instanceof UploadedFile) {
                $this->storeCoverMedia($vocational_program, $coverFile, $coverAlt);
            } elseif (! $request->boolean('remove_cover') && $altProvided) {
                $this->updateCoverAlt($vocational_program, $coverAlt);
            }

            if ($galleryFiles !== []) {
                $this->storeGalleryMedia($vocational_program, $galleryFiles, $galleryAlt);
            }

            $this->refreshPhotosColumn($vocational_program);
        });

        $this->recordRedirect($originalSlug, $vocational_program->slug, '/vokasional/');

        return back()->with('success', 'Program diperbarui');
    }

    public function destroy(VocationalProgram $vocational_program): RedirectResponse
    {
        $vocational_program->load('media');

        $vocational_program->media->each(function (MediaItem $media): void {
            $this->deleteMediaRecord($media);
        });

        $vocational_program->delete();

        return back();
    }

    public function deleteMedia(VocationalProgram $vocational_program, MediaItem $media): RedirectResponse
    {
        // Ensure the media belongs to the program
        if ($media->vocational_program_id !== $vocational_program->id) {
            abort(403);
        }

        $this->deleteMediaRecord($media);

        $this->refreshPhotosColumn($vocational_program->refresh());

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

    private function validateData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['required', 'alpha_dash', Rule::unique('vocational_programs', 'slug')->ignore($ignoreId)],
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'audience' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:255'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'kurikulum' => ['nullable', 'array'],
            'kurikulum.*' => ['nullable', 'string', 'max:255'],
            'fasilitas' => ['nullable', 'array'],
            'fasilitas.*' => ['nullable', 'string', 'max:255'],
            'mentors' => ['nullable', 'array'],
            'mentors.*' => ['nullable', 'string', 'max:255'],
            'cover' => [
                $ignoreId ? 'nullable' : 'required',
                'file',
                'mimetypes:image/jpeg,image/png,image/webp',
            ],
            'cover_alt' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['file', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4'],
            'gallery_alt' => ['nullable', 'array'],
            'gallery_alt.*' => ['nullable', 'string', 'max:255'],
            'remove_cover' => ['sometimes', 'boolean'],
        ]);
    }

    private function programPayload(Request $request, array $data): array
    {
        return [
            'slug' => $data['slug'],
            'title' => $data['title'],
            'description' => $request->input('description'),
            'audience' => $request->input('audience'),
            'duration' => $request->input('duration'),
            'schedule' => $request->input('schedule'),
            'outcomes' => $this->normaliseStringArray($request->input('kurikulum')),
            'facilities' => $this->normaliseStringArray($request->input('fasilitas')),
            'mentors' => $this->normaliseStringArray($request->input('mentors')),
        ];
    }

    /**
     * @param  UploadedFile[]  $files
     */
    private function storeGalleryMedia(VocationalProgram $program, array $files, array $altValues): void
    {
        foreach (array_values($files) as $index => $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $mime = (string) $file->getMimeType();
            $alt = $altValues[$index] ?? null;

            if (str_starts_with($mime, 'image/') && ($alt === null || $alt === '')) {
                throw ValidationException::withMessages([
                    "gallery_alt.$index" => 'Alt teks wajib diisi untuk gambar galeri.',
                ]);
            }

            $path = $file->store('vocational-programs/gallery', 'public');

            $program->media()->create([
                'type' => str_starts_with($mime, 'video/') ? 'video' : 'image',
                'url' => $path,
                'alt' => $alt ?: $program->title,
            ]);
        }
    }

    private function storeCoverMedia(VocationalProgram $program, UploadedFile $file, ?string $alt): void
    {
        $this->deleteExistingCover($program);

        $path = $file->store('vocational-programs/cover', 'public');

        $program->media()->create([
            'type' => 'cover',
            'url' => $path,
            'alt' => $alt ?: $program->title,
        ]);
    }

    private function updateCoverAlt(VocationalProgram $program, ?string $alt): void
    {
        $program->media()
            ->where('type', 'cover')
            ->get()
            ->each(function (MediaItem $media) use ($alt): void {
                $media->update(['alt' => $alt]);
            });
    }

    private function deleteExistingCover(VocationalProgram $program): void
    {
        $program->media()
            ->where('type', 'cover')
            ->get()
            ->each(function (MediaItem $media): void {
                $this->deleteMediaRecord($media);
            });
    }

    private function deleteMediaRecord(MediaItem $media): void
    {
        if ($media->url && Storage::disk('public')->exists($media->url)) {
            Storage::disk('public')->delete($media->url);
        }

        $media->delete();
    }

    private function refreshPhotosColumn(VocationalProgram $program): void
    {
        $program->load('media');

        $paths = $program->media
            ->pluck('url')
            ->filter()
            ->unique()
            ->values()
            ->all();

        $program->forceFill([
            'photos' => $paths === [] ? null : $paths,
        ])->save();
    }

    /**
     * @param  UploadedFile|array<int, UploadedFile>|null  $files
     * @return UploadedFile[]
     */
    private function normaliseUploadedFiles($files): array
    {
        if ($files === null) {
            return [];
        }

        if ($files instanceof UploadedFile) {
            return [$files];
        }

        return array_values(array_filter($files, fn ($file) => $file instanceof UploadedFile));
    }

    private function normaliseAltValues(mixed $values): array
    {
        if (! is_array($values)) {
            return [];
        }

        return array_values(array_map(function ($value) {
            return is_string($value) ? trim($value) : null;
        }, $values));
    }

    private function normaliseStringArray(mixed $values): ?array
    {
        if (! is_array($values)) {
            return null;
        }

        $normalised = array_values(array_filter(array_map(function ($value) {
            return is_string($value) ? trim($value) : null;
        }, $values), fn (?string $value) => $value !== null && $value !== ''));

        return $normalised === [] ? null : $normalised;
    }

    private function normaliseText(?string $value): ?string
    {
        $value = $value !== null ? trim($value) : null;

        return $value === '' ? null : $value;
    }
}

