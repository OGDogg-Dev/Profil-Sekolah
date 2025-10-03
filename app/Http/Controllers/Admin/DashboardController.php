<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\MediaItem;
use App\Models\Post;
use App\Models\VocationalProgram;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $programs = VocationalProgram::select(['id', 'title', 'outcomes'])->get();
        $messagesTotal = ContactMessage::count();
        $unreadMessages = ContactMessage::query()
            ->where(fn ($query) => $query->whereNull('is_read')->orWhere('is_read', false))
            ->count();

        $totalPosts = Post::count();
        $publishedPosts = Post::where('status', 'published')->count();
        $draftPosts = Post::where('status', 'draft')->latest('created_at')->take(10)->get([
            'id',
            'title',
            'status',
            'slug',
            'published_at',
            'created_at',
        ]);

        $upcomingEvents = Event::query()
            ->orderBy('start_at')
            ->take(5)
            ->get(['id', 'title', 'slug', 'start_at', 'location']);

        $recentMessages = ContactMessage::query()
            ->latest()
            ->take(6)
            ->get(['id', 'name', 'message', 'created_at', 'is_read']);

        $resourceSummary = MediaItem::query()
            ->selectRaw('COALESCE(type, "media") as type, COUNT(*) as total')
            ->groupBy('type')
            ->get()
            ->map(fn ($row) => [
                'type' => $row->type,
                'total' => (int) $row->total,
            ])
            ->values()
            ->toArray();

        $gradeByProgram = $programs
            ->map(function (VocationalProgram $program) {
                $outcomes = collect($program->outcomes ?? [])
                    ->filter(fn ($value) => filled($value))
                    ->count();

                $score = (int) min(100, 60 + ($outcomes * 8));

                return [
                    'label' => $program->title,
                    'score' => $score,
                ];
            })
            ->values();

        if ($gradeByProgram->isEmpty()) {
            $gradeByProgram = collect([
                ['label' => 'Komputer', 'score' => 78],
                ['label' => 'Fotografi', 'score' => 82],
                ['label' => 'Elektronika', 'score' => 74],
                ['label' => 'Kriya', 'score' => 69],
            ]);
        }

        $assignments = $draftPosts
            ->map(function (Post $post) {
                $effectiveDate = $post->published_at ?? $post->created_at;

                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'subject' => 'Konten Berita',
                    'dueDate' => $effectiveDate?->translatedFormat('d M Y'),
                    'status' => $post->status,
                    'url' => route('admin.posts.edit', $post->id),
                ];
            })
            ->values()
            ->toArray();

        $noticeBoard = $upcomingEvents
            ->take(3)
            ->map(function (Event $event) {
                $startAt = $event->start_at ? Carbon::parse($event->start_at) : null;

                return [
                    'title' => $event->title,
                    'date' => $startAt?->translatedFormat('d M'),
                    'time' => $startAt?->format('H.i'),
                    'location' => $event->location,
                    'url' => route('admin.events.edit', $event->id),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('admin/Dashboard', [
            'counts' => [
                'programs' => $programs->count(),
                'messages' => $messagesTotal,
                'unreadMessages' => $unreadMessages,
                'posts' => $totalPosts,
                'publishedPosts' => $publishedPosts,
                'events' => Event::count(),
                'upcomingEvents' => Event::query()->where('start_at', '>=', Carbon::now())->count(),
                'albums' => Album::count(),
            ],
            'overview' => [
                'attendance' => min(100, max(68, $programs->count() * 6 + 68)),
                'taskCompletion' => $totalPosts > 0 ? round(($publishedPosts / $totalPosts) * 100) : 0,
                'inProgress' => $draftPosts->count(),
                'rewardPoints' => $messagesTotal * 5,
            ],
            'scoreActivity' => $this->buildMonthlyActivity(),
            'gradeByProgram' => $gradeByProgram->take(6)->values()->toArray(),
            'upcomingEvents' => $upcomingEvents
                ->map(function (Event $event) {
                    $startAt = $event->start_at ? Carbon::parse($event->start_at) : null;

                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'date' => $startAt?->translatedFormat('d M'),
                        'time' => $startAt?->format('H.i'),
                        'location' => $event->location,
                    ];
                })
                ->values()
                ->toArray(),
            'recentMessages' => $recentMessages
                ->map(fn (ContactMessage $message) => [
                    'id' => $message->id,
                    'name' => $message->name,
                    'message' => str($message->message)->limit(80)->toString(),
                    'time' => $message->created_at?->diffForHumans(),
                    'isRead' => (bool) $message->is_read,
                ])
                ->values()
                ->toArray(),
            'assignments' => $assignments,
            'resourceSummary' => $resourceSummary,
            'noticeBoard' => $noticeBoard,
        ]);
    }

    private function buildMonthlyActivity(): array
    {
        $months = collect(range(0, 5))
            ->map(function (int $offset) {
                $month = Carbon::now()->subMonths(5 - $offset)->startOfMonth();

                return (object) [
                    'key' => $month->format('Y-m'),
                    'label' => $month->translatedFormat('M'),
                    'value' => 0,
                ];
            })
            ->keyBy('key');

        $windowStart = Carbon::now()->subMonths(5)->startOfMonth();

        ContactMessage::query()
            ->where('created_at', '>=', $windowStart)
            ->get(['created_at'])
            ->each(function (ContactMessage $message) use (&$months) {
                $date = $message->created_at ? Carbon::parse($message->created_at) : null;

                if (! $date) {
                    return;
                }

                $key = $date->format('Y-m');

                if ($months->has($key)) {
                    $months[$key]->value++;
                }
            });

        Post::query()
            ->whereNotNull('published_at')
            ->where('published_at', '>=', $windowStart)
            ->get(['published_at'])
            ->each(function (Post $post) use (&$months) {
                $date = Carbon::parse($post->published_at);
                $key = $date->format('Y-m');

                if ($months->has($key)) {
                    $months[$key]->value += 2;
                }
            });

        return $months
            ->values()
            ->map(fn ($month) => [
                'label' => $month->label,
                'value' => $month->value,
            ])
            ->toArray();
    }
}

