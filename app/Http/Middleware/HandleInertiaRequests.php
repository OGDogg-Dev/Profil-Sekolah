<?php

namespace App\Http\Middleware;

use App\Facades\SiteContent;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'settings' => $this->publicSettings(),
        ];
    }

    private function publicSettings(): array
    {
        $logo = SiteContent::getMedia('logo', 'global');
        $og = SiteContent::getMedia('og', 'global');

        return [
            'name' => SiteContent::getSetting('general', 'site_name'),
            'tagline' => SiteContent::getSetting('general', 'tagline'),
            'logo_url' => $logo ? SiteContent::url($logo) : null,
            'phone' => SiteContent::getSetting('general', 'phone'),
            'whatsapp' => SiteContent::getSetting('general', 'whatsapp'),
            'email' => SiteContent::getSetting('general', 'email'),
            'address' => SiteContent::getSetting('general', 'address'),
            'social' => SiteContent::getSetting('general', 'social', []),
            'footer_hours' => SiteContent::getSetting('general', 'footer_hours', []),
            'og_image_url' => $og ? SiteContent::url($og) : null,
        ];
    }
}
