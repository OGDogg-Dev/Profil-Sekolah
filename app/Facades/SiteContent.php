<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed getSetting(string $section, string $key, mixed $default = null)
 * @method static void forgetSetting(string $section, string $key)
 * @method static \Illuminate\Support\Collection|\App\Models\MediaAsset|null getMedia(string $collection, ?string $key = null)
 * @method static string url(\App\Models\MediaAsset $asset)
 *
 * @see \App\Support\SiteContent
 */
class SiteContent extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Support\SiteContent::class;
    }
}
