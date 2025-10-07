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
        ?string $alt = null,
        bool $replaceExisting = true
    ): MediaAsset {
        $disk = 'public';
        $directory = sprintf('%s/%s', $collection, now()->format('Y/m'));
        $filename = sprintf('%s.%s', (string) Str::uuid(), $file->getClientOriginalExtension());
        $path = $file->storeAs($directory, $filename, $disk);

        $attributes = [
            'collection' => $collection,
            'key' => $key,
            'disk' => $disk,
            'path' => $path,
            'type' => $file->getMimeType() ?? $file->getClientOriginalExtension(),
            'alt' => $alt,
        ];

        if ($replaceExisting) {
            $existing = MediaAsset::query()
                ->where('collection', $collection)
                ->when($key !== null, fn ($query) => $query->where('key', $key))
                ->first();

            if ($existing) {
                $this->deleteAssetFile($existing);

                $existing->fill($attributes);
                $existing->save();

                return $existing;
            }
        }

        return MediaAsset::create($attributes);
    }

    protected function deleteAssetFile(MediaAsset $asset): void
    {
        $disk = $asset->disk ?: 'public';

        if (Storage::disk($disk)->exists($asset->path)) {
            Storage::disk($disk)->delete($asset->path);
        }
    }
}

