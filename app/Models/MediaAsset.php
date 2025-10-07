<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'collection',
        'key',
        'disk',
        'path',
        'type',
        'alt',
        'focal_x',
        'focal_y',
    ];
}
