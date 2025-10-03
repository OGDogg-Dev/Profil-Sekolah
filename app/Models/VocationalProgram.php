<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VocationalProgram extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'icon',
        'description',
        'audience',
        'duration',
        'schedule',
        'outcomes',
        'facilities',
        'mentors',
        'photos',
    ];

    protected $casts = [
        'outcomes' => 'array',
        'facilities' => 'array',
        'mentors' => 'array',
        'photos' => 'array',
    ];

    public function media(): HasMany
    {
        return $this->hasMany(MediaItem::class);
    }
}
