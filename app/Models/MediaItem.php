<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaItem extends Model
{
    protected $fillable = [
        'vocational_program_id',
        'type',
        'url',
        'poster',
        'alt',
        'caption',
        'track_vtt',
    ];

    public function getUrlAttribute($value): ?string
    {
        if (! $value) {
            return $value;
        }

        if (Str::startsWith($value, ['http://', 'https://', '/'])) {
            return $value;
        }

        return Storage::disk('public')->url($value);
    }
}
