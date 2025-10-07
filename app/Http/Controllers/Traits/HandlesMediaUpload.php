<?php

namespace App\Http\Controllers\Traits;

use App\Models\MediaAsset;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait HandlesMediaUpload
{
    protected function storeMedia(
        UploadedFile $file,
        string $collection,
        ?string $key = null,
        ?string $alt = null
    ): MediaAsset {
        $disk = 'public';
        $directory = sprintf('%s/%s', $collection, now()->format('Y/m'));
        $filename = sprintf('%s.%s', (string) Str::uuid(), $file->getClientOriginalExtension());
        $path = $file->storeAs($directory, $filename, $disk);

        return MediaAsset::create([
            'collection' => $collection,
            'key' => $key,
            'disk' => $disk,
            'path' => $path,
            'type' => $file->getMimeType() ?? $file->getClientOriginalExtension(),
            'alt' => $alt,
        ]);
    }

    protected function replaceSingleton(
        UploadedFile $file,
        string $collection,
        string $key,
        ?string $alt = null
    ): MediaAsset {
        $this->deleteByKey($collection, $key);

        return $this->storeMedia($file, $collection, $key, $alt);
    }

    protected function deleteMedia(MediaAsset $asset): void
    {
        $disk = $asset->disk ?: 'public';

        if (Storage::disk($disk)->exists($asset->path)) {
            Storage::disk($disk)->delete($asset->path);
        }

        $asset->delete();
    }

    protected function deleteByKey(string $collection, string $key): void
    {
        MediaAsset::query()
            ->where('collection', $collection)
            ->where('key', $key)
            ->get()
            ->each(function (MediaAsset $asset): void {
                $this->deleteMedia($asset);
            });
    }
}

