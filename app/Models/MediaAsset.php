<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    protected $fillable = [
        'collection',
        'key',
        'disk',
        'path',
        'type',
        'alt',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
