<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function form(): Response
    {
        return Inertia::render('public/Contact', [
            'title' => 'Hubungi Kami',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        ContactMessage::create($data);

        return back()->with('success', 'Pesan terkirim. Terima kasih!');
    }
}
