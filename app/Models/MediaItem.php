<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
