<?php

namespace App\Support;

use App\Models\MediaAsset;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class SiteContent
{
    private const CACHE_KEY_FORMAT = 'site:set:%s:%s';

    public function __construct(
        private readonly ConnectionInterface $connection,
        private readonly CacheRepository $cache,
        private readonly FilesystemFactory $storage
    ) {
    }

    /**
     * Retrieve a structured site setting value with caching.
     */
    public function getSetting(string $section, string $key, mixed $default = null): mixed
    {
        $cacheKey = sprintf(self::CACHE_KEY_FORMAT, $section, $key);

        return $this->cache->remember($cacheKey, now()->addMinutes(10), function () use ($section, $key, $default) {
            $record = $this->builder()
                ->where('section', $section)
                ->where('key', $key)
                ->first();

            if (! $record) {
                return $default;
            }

            $value = $record->value_json ?? null;

            if (is_string($value)) {
                $decoded = json_decode($value, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    return $decoded;
                }
            }

            if (is_array($value)) {
                return $value;
            }

            if (is_object($value)) {
                return json_decode(json_encode($value), true);
            }

            return $value ?? $default;
        });
    }

    /**
     * Fetch media assets for a collection optionally scoped by key.
     */
    public function getMedia(string $collection, ?string $key = null): Collection|MediaAsset|null
    {
        $query = MediaAsset::query()->where('collection', $collection);

        if ($key !== null) {
            $asset = $query->where('key', $key)->first();

            if ($collection === 'og' && ! $asset) {
                return $this->resolveOgFallback();
            }

            return $asset;
        }

        $assets = $query->orderBy('id')->get();

        if ($collection === 'og' && $assets->isEmpty()) {
            $fallback = $this->resolveOgFallback();

            if ($fallback) {
                return collect([$fallback]);
            }
        }

        return $assets;
    }

    /**
     * Build a publicly accessible URL for the given media asset.
     */
    public function url(MediaAsset $asset): string
    {
        $path = $asset->path;

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        $disk = $asset->disk ?: 'public';

        return $this->storage->disk($disk)->url($path);
    }

    private function builder(): Builder
    {
        return $this->connection->table('new_site_settings')->select('value_json');
    }

    private function resolveOgFallback(): ?MediaAsset
    {
        $fallback = $this->getSetting('global', 'ogImage');

        return $this->normaliseMediaFallback($fallback);
    }

    private function normaliseMediaFallback(mixed $fallback): ?MediaAsset
    {
        if (! $fallback) {
            return null;
        }

        if ($fallback instanceof MediaAsset) {
            return $fallback;
        }

        if (is_numeric($fallback)) {
            return MediaAsset::find((int) $fallback);
        }

        if (is_array($fallback)) {
            if (isset($fallback['id'])) {
                return MediaAsset::find((int) $fallback['id']);
            }

            if (! isset($fallback['path'])) {
                return null;
            }

            $attributes = array_intersect_key($fallback, array_flip([
                'collection',
                'key',
                'disk',
                'path',
                'type',
                'alt',
                'focal_x',
                'focal_y',
            ]));

            $attributes['collection'] = $attributes['collection'] ?? 'og';
            $attributes['disk'] = $attributes['disk'] ?? 'public';

            return MediaAsset::make($attributes);
        }

        if (is_string($fallback)) {
            return MediaAsset::make([
                'collection' => 'og',
                'disk' => 'public',
                'path' => $fallback,
            ]);
        }

        return null;
    }
}
