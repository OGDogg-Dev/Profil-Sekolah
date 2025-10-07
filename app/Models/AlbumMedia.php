<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AlbumMedia extends Model
{
    protected $fillable = [
        'album_id',
        'type',
        'url',
        'caption',
        'poster',
        'track_vtt',
        'sort',
    ];

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    public function getUrlAttribute($value): ?string
    {
        if (! $value) {
            return null;
        }

        if (Str::startsWith($value, ['http://', 'https://', '/'])) {
            return $value;
        }

        return Storage::disk('public')->url($value);
    }
}
