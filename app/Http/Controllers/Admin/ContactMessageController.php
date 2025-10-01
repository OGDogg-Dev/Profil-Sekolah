<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = ContactMessage::query()->latest();

        if ($status === 'unread') {
            $query->where('is_read', false);
        } elseif ($status === 'read') {
            $query->where('is_read', true);
        }

        $items = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/contacts/Index', [
            'items' => $items,
            'filters' => [
                'status' => $status ?: 'all',
            ],
        ]);
    }

    public function show(int $id): Response
    {
        $item = ContactMessage::findOrFail($id);

        if (!$item->is_read) {
            $item->forceFill(['is_read' => true])->save();
        }

        return Inertia::render('admin/contacts/Show', [
            'item' => $item,
        ]);
    }

    public function mark(Request $request, int $id): RedirectResponse
    {
        $item = ContactMessage::findOrFail($id);
        $item->update([
            'is_read' => $request->boolean('is_read', true),
        ]);

        return back()->with('success', 'Status pesan diperbarui.');
    }
}
