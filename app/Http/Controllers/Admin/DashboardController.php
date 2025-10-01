<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\VocationalProgram;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Dashboard', [
            'counts' => [
                'programs' => VocationalProgram::count(),
                'messages' => ContactMessage::count(),
            ],
        ]);
    }
}
