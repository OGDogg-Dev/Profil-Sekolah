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

        if ($this->shouldAutoCrop($collection) && $this->isImageFile($file)) {
            [$path, $mime] = $this->storeCroppedImage($file, $disk, $directory);
        } else {
            [$path, $mime] = $this->storeRawFile($file, $disk, $directory);
        }

        return MediaAsset::create([
            'collection' => $collection,
            'key' => $key,
            'disk' => $disk,
            'path' => $path,
            'type' => $mime,
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

    private function storeRawFile(UploadedFile $file, string $disk, string $directory): array
    {
        $extension = $this->normaliseExtension($file);
        $filename = sprintf('%s.%s', (string) Str::uuid(), $extension);
        $path = sprintf('%s/%s', $directory, $filename);

        Storage::disk($disk)->putFileAs($directory, $file, $filename);

        return [$path, $file->getMimeType() ?? $this->mimeFromExtension($extension)];
    }

    private function storeCroppedImage(UploadedFile $file, string $disk, string $directory): array
    {
        $contents = @file_get_contents($file->getRealPath());
        if ($contents === false) {
            return $this->storeRawFile($file, $disk, $directory);
        }

        $resource = @imagecreatefromstring($contents);
        if ($resource === false) {
            return $this->storeRawFile($file, $disk, $directory);
        }

        $targetRatio = 16 / 9;
        $width = imagesx($resource);
        $height = imagesy($resource);

        if ($width > 0 && $height > 0) {
            $currentRatio = $width / $height;

            if ($currentRatio > $targetRatio) {
                $newWidth = (int) round($height * $targetRatio);
                $x = (int) max(0, floor(($width - $newWidth) / 2));
                $cropped = imagecrop($resource, [
                    'x' => $x,
                    'y' => 0,
                    'width' => $newWidth,
                    'height' => $height,
                ]);

                if ($cropped !== false) {
                    imagedestroy($resource);
                    $resource = $cropped;
                }
            } elseif ($currentRatio < $targetRatio) {
                $newHeight = (int) round($width / $targetRatio);
                $y = (int) max(0, floor(($height - $newHeight) / 2));
                $cropped = imagecrop($resource, [
                    'x' => 0,
                    'y' => $y,
                    'width' => $width,
                    'height' => $newHeight,
                ]);

                if ($cropped !== false) {
                    imagedestroy($resource);
                    $resource = $cropped;
                }
            }
        }

        ob_start();
        $encoded = $this->encodeImageResource($resource, $this->normaliseExtension($file));
        if ($encoded === null) {
            ob_end_clean();
            imagedestroy($resource);

            return $this->storeRawFile($file, $disk, $directory);
        }

        [$storedMime, $extension] = $encoded;
        $binary = ob_get_clean();
        imagedestroy($resource);

        if (! is_string($binary) || $binary === '') {
            return $this->storeRawFile($file, $disk, $directory);
        }

        $filename = sprintf('%s.%s', (string) Str::uuid(), $extension);
        $path = sprintf('%s/%s', $directory, $filename);

        Storage::disk($disk)->put($path, $binary);

        return [$path, $storedMime];
    }

    private function encodeImageResource($resource, string $extension): ?array
    {
        $extension = strtolower($extension);

        switch ($extension) {
            case 'png':
                if (! imagepng($resource)) {
                    return null;
                }

                return ['image/png', 'png'];
            case 'webp':
                if (function_exists('imagewebp') && imagewebp($resource, null, 90)) {
                    return ['image/webp', 'webp'];
                }
                // fallthrough when webp unsupported
        }

        if (! imagejpeg($resource, null, 90)) {
            return null;
        }

        return ['image/jpeg', 'jpg'];
    }

    private function shouldAutoCrop(string $collection): bool
    {
        return in_array($collection, ['cover', 'hero', 'og'], true);
    }

    private function isImageFile(UploadedFile $file): bool
    {
        $mime = (string) $file->getMimeType();

        return str_starts_with($mime, 'image/');
    }

    private function normaliseExtension(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: '');

        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        if ($this->isImageFile($file)) {
            return in_array($extension, ['jpg', 'png', 'webp'], true) ? $extension : 'jpg';
        }

        if ($extension === 'mp4') {
            return 'mp4';
        }

        return $extension !== '' ? $extension : 'bin';
    }

    private function mimeFromExtension(string $extension): string
    {
        return match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'mp4' => 'video/mp4',
            default => 'application/octet-stream',
        };
    }
}

