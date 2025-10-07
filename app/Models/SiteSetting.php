<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    // Normalized schema stores values in `value_json` as json.
    protected $fillable = [
        'section',
        'key',
        'value_json',
        'meta',
    ];

    protected $casts = [
        'value_json' => 'array',
        'meta' => 'array',
    ];
}
