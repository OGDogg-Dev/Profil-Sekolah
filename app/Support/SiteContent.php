<?php
namespace App\Support;

use App\Models\MediaAsset;
use App\Models\SiteContentEntry;
use App\Models\SiteSetting;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SiteContent
{
    protected static array $settingsCache = [];
    protected static array $mediaCache = [];

    public static function get(string $key, mixed $default = null, string $section = 'general'): mixed
    {
        $settings = self::settingsForSection($section);

        return $settings[$key] ?? $default;
    }

    public static function getJson(string $key, array $default = [], string $section = 'general'): array
    {
        $value = self::get($key, null, $section);

        if (is_array($value)) {
            return $value;
        }

        if (is_string($value) && trim($value) !== '') {
            $decoded = json_decode($value, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        return $default;
    }

    public static function section(string $section, array $defaults = []): array
    {
        $settings = self::settingsForSection($section);

        if (empty($settings)) {
            return $defaults;
        }

        return array_replace_recursive($defaults, $settings);
    }

    public static function media(string $key, string $collection = 'general'): ?MediaAsset
    {
        $media = self::mediaForCollection($collection);

        return $media[$key] ?? null;
    }

    public static function clearCache(): void
    {
        self::$settingsCache = [];
        self::$mediaCache = [];
    }

    protected static function settingsForSection(string $section): array
    {
        if (! isset(self::$settingsCache[$section])) {
            $entries = SiteContentEntry::query()
                ->where('section', $section)
                ->get()
                ->mapWithKeys(function (SiteContentEntry $entry) {
                    $value = $entry->value;

                    if ($entry->type === 'json') {
                        $decoded = json_decode($entry->value ?? '', true);

                        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                            $value = $decoded;
                        } else {
                            $value = [];
                        }
                    }

                    if (is_string($value)) {
                        $value = trim($value);
                    }

                    return [$entry->key => $value];
                })
                ->toArray();

            if ($section === 'general') {
                $generalRow = SiteSetting::query()->first();

                if ($generalRow) {
                    $generalValues = Arr::only($generalRow->toArray(), [
                        'site_name',
                        'tagline',
                        'address',
                        'phone',
                        'fax',
                        'email',
                        'logo_path',
                    ]);

                    $entries = array_merge($entries, array_filter($generalValues, fn ($value) => $value !== null && $value !== ''));
                }
            }

            self::$settingsCache[$section] = $entries;
        }

        return self::$settingsCache[$section];
    }

    protected static function mediaForCollection(string $collection): array
    {
        if (! isset(self::$mediaCache[$collection])) {
            self::$mediaCache[$collection] = MediaAsset::query()
                ->where('collection', $collection)
                ->get()
                ->keyBy('key')
                ->all();
        }

        return self::$mediaCache[$collection];
    }
}
