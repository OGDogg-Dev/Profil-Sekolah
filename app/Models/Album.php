<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Album extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'cover_url',
        'description',
    ];

    protected static function booted(): void
    {
        static::saving(function (Album $album) {
            if (empty($album->slug)) {
                $album->slug = Str::slug($album->title);
            }
        });
    }

    public function media(): HasMany
    {
        return $this->hasMany(AlbumMedia::class)->orderBy('sort')->orderBy('id');
    }

    public function mediaCount(): int
    {
        return $this->media()->count();
    }
}
