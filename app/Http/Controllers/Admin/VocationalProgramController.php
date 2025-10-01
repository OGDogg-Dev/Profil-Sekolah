<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VocationalProgram;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VocationalProgramController extends Controller
{
    public function index(): Response
    {
        $items = VocationalProgram::select('id', 'slug', 'title', 'schedule')->get();

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
        ]);

        VocationalProgram::create($data);

        return redirect()->route('admin.vocational-programs.index');
    }

    public function edit(VocationalProgram $vocational_program): Response
    {
        return Inertia::render('admin/voc/Form', [
            'item' => $vocational_program,
        ]);
    }

    public function update(Request $request, VocationalProgram $vocational_program): RedirectResponse
    {
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
        ]);

        $vocational_program->update($data);

        return back()->with('success', 'Program diperbarui');
    }

    public function destroy(VocationalProgram $vocational_program): RedirectResponse
    {
        $vocational_program->delete();

        return back();
    }
}

