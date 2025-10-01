<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
