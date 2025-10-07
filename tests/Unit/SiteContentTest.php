<?php

use App\Support\SiteContent;
use Illuminate\Cache\ArrayStore;
use Illuminate\Cache\Repository as CacheRepository;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Query\Builder;
use Mockery;

it('returns default when site setting is missing', function () {
    $connection = Mockery::mock(ConnectionInterface::class);
    $builder = Mockery::mock(Builder::class);

    $connection->shouldReceive('table')
        ->once()
        ->with('new_site_settings')
        ->andReturn($builder);

    $builder->shouldReceive('select')
        ->once()
        ->with('value_json')
        ->andReturnSelf();

    $builder->shouldReceive('where')
        ->once()
        ->with('section', 'general')
        ->andReturnSelf();

    $builder->shouldReceive('where')
        ->once()
        ->with('key', 'tagline')
        ->andReturnSelf();

    $builder->shouldReceive('first')
        ->once()
        ->andReturn(null);

    $cache = new CacheRepository(new ArrayStore());
    $storage = Mockery::mock(FilesystemFactory::class);

    $siteContent = new SiteContent($connection, $cache, $storage);

    expect($siteContent->getSetting('general', 'tagline', 'default value'))
        ->toBe('default value');

    Mockery::close();
});
