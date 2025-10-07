<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\VocationalProgram;
use Inertia\Inertia;
use Inertia\Response;

class VocationalController extends Controller
{
    public function index(): Response
    {
        $items = VocationalProgram::with('media')
            ->select('id', 'slug', 'title', 'description', 'duration', 'schedule')
            ->get();

        return Inertia::render('vocational/Index', [
            'items' => $items,
        ]);
    }

    public function show(string $slug): Response
    {
        $program = VocationalProgram::with('media')
            ->select('id', 'slug', 'title', 'icon', 'description', 'audience', 'duration', 'schedule', 'outcomes', 'facilities', 'mentors', 'photos')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('vocational/Detail', [
            'program' => $program,
        ]);
    }
}
