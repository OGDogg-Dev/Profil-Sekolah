<?php

namespace App\Http\Middleware;

use App\Facades\SiteContent;
use App\Models\MediaAsset;
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
        $name = SiteContent::getSetting('general', 'site_name')
            ?? SiteContent::getSetting('general', 'name')
            ?? config('app.name');

        $tagline = SiteContent::getSetting('general', 'tagline')
            ?? SiteContent::getSetting('general', 'site_tagline');

        $phone = SiteContent::getSetting('general', 'phone');
        $whatsapp = SiteContent::getSetting('general', 'whatsapp');
        $email = SiteContent::getSetting('general', 'email');
        $address = SiteContent::getSetting('general', 'address');
        $social = SiteContent::getSetting('general', 'social', []);
        $footerHours = SiteContent::getSetting('general', 'footer_hours', []);

        $logo = $this->resolveMediaUrl(
            SiteContent::getMedia('logo', 'global')
        ) ?? $this->resolveMediaUrl(
            SiteContent::mediaFromValue(SiteContent::getSetting('general', 'logo'))
        );

        $og = $this->resolveMediaUrl(
            SiteContent::getMedia('og', 'global')
        ) ?? $this->resolveMediaUrl(
            SiteContent::mediaFromValue(SiteContent::getSetting('general', 'ogImage'))
        );

        return [
            'name' => $name,
            'site_name' => $name,
            'tagline' => $tagline,
            'logo_url' => $logo,
            'og_image_url' => $og,
            'phone' => $phone,
            'whatsapp' => $whatsapp,
            'email' => $email,
            'address' => $address,
            'social' => $this->normaliseSocial($social),
            'footer_hours' => $this->normaliseFooterHours($footerHours),
        ];
    }

    private function resolveMediaUrl(MediaAsset|array|string|null $value): ?string
    {
        if ($value instanceof MediaAsset) {
            return SiteContent::url($value);
        }

        if (is_array($value)) {
            if (isset($value['url']) && is_string($value['url']) && $value['url'] !== '') {
                return $value['url'];
            }

            if (isset($value['path']) && is_string($value['path']) && $value['path'] !== '') {
                $asset = SiteContent::mediaFromValue($value);

                return $asset instanceof MediaAsset ? SiteContent::url($asset) : $value['path'];
            }
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }

    private function normaliseSocial(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $items = [];

        if (array_is_list($value)) {
            foreach ($value as $entry) {
                if (! is_array($entry)) {
                    continue;
                }

                $label = isset($entry['label']) && is_string($entry['label']) ? trim($entry['label']) : null;
                $url = isset($entry['url']) && is_string($entry['url']) ? trim($entry['url']) : null;
                $icon = isset($entry['icon']) && is_string($entry['icon']) ? trim($entry['icon']) : null;

                if ($label || $url) {
                    $items[] = array_filter([
                        'label' => $label,
                        'url' => $url,
                        'icon' => $icon,
                    ], fn ($item) => $item !== null && $item !== '');
                }
            }

            return $items;
        }

        foreach ($value as $label => $url) {
            $labelString = is_string($label) ? trim($label) : null;
            $urlString = is_string($url) ? trim($url) : null;

            if ($labelString || $urlString) {
                $items[] = array_filter([
                    'label' => $labelString,
                    'url' => $urlString,
                ], fn ($item) => $item !== null && $item !== '');
            }
        }

        return $items;
    }

    private function normaliseFooterHours(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $slots = [];

        $normaliseEntry = function (array $entry): ?array {
            $day = isset($entry['day']) && is_string($entry['day']) ? trim($entry['day']) : null;
            $label = isset($entry['label']) && is_string($entry['label']) ? trim($entry['label']) : $day;
            $open = isset($entry['open']) && is_string($entry['open']) ? trim($entry['open']) : null;
            $close = isset($entry['close']) && is_string($entry['close']) ? trim($entry['close']) : null;

            $time = isset($entry['time']) && is_string($entry['time']) ? trim($entry['time']) : null;

            if (! $time) {
                $valueField = isset($entry['value']) && is_string($entry['value']) ? trim($entry['value']) : null;
                $time = $valueField ?: trim(implode(' - ', array_filter([$open, $close])));
            }

            if (! $label && ! $time) {
                return null;
            }

            return [
                'day' => $day,
                'label' => $label,
                'time' => $time,
                'open' => $open,
                'close' => $close,
                'value' => $time,
            ];
        };

        if (array_is_list($value)) {
            foreach ($value as $entry) {
                if (! is_array($entry)) {
                    continue;
                }

                $normalised = $normaliseEntry($entry);

                if ($normalised !== null) {
                    $slots[] = $normalised;
                }
            }

            return $slots;
        }

        foreach ($value as $label => $time) {
            $normalised = $normaliseEntry([
                'label' => is_string($label) ? $label : null,
                'time' => is_string($time) ? $time : null,
            ]);

            if ($normalised !== null) {
                $slots[] = $normalised;
            }
        }

        return $slots;
    }
}
