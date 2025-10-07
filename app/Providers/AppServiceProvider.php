<?php

namespace App\Providers;

use App\Support\SiteContent;
use Illuminate\Contracts\Cache\Factory as CacheFactory;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(SiteContent::class, function ($app) {
            return new SiteContent(
                $app->make(DatabaseManager::class)->connection(),
                $app->make(CacheFactory::class)->store(),
                $app->make(FilesystemFactory::class),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
