<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContentEntry extends Model
{
    protected $fillable = [
        'section',
        'key',
        'type',
        'value',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
