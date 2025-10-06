<?php

use App\Http\Controllers\Admin\AlbumController as AdminAlbumController;
use App\Http\Controllers\Admin\AlbumMediaController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\MediaItemController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\VocationalProgramController;
use App\Http\Controllers\Public\AlbumController as PubAlbumController;
use App\Http\Controllers\Public\ContactController as PubContactController;
use App\Http\Controllers\Public\EventController as PubEventController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\PageController as PubPageController;
use App\Http\Controllers\Public\PostController as PubPostController;
use App\Http\Controllers\Public\VocationalController as PubVocController;
use Illuminate\Support\Facades\Route;

// PUBLIC
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/profil', [PubPageController::class, 'showProfile'])->name('page.profil');
Route::get('/visi-misi', [PubPageController::class, 'showVisionMission'])->name('page.visimisi');
Route::get('/vokasional', [PubVocController::class, 'index'])->name('voc.index');
Route::get('/vokasional/{slug}', [PubVocController::class, 'show'])->name('voc.show');
Route::get('/berita', [PubPostController::class, 'index'])->name('posts.index');
Route::get('/berita/{slug}', [PubPostController::class, 'show'])->name('posts.show');
Route::get('/agenda', [PubEventController::class, 'index'])->name('events.index');
Route::get('/agenda/{slug}', [PubEventController::class, 'show'])->name('events.show');
Route::get('/galeri', [PubAlbumController::class, 'index'])->name('albums.index');
Route::get('/galeri/{slug}', [PubAlbumController::class, 'show'])->name('albums.show');
Route::get('/hubungi-kami', [PubContactController::class, 'form'])->name('contact.form');
Route::post('/hubungi-kami', [PubContactController::class, 'store'])
    ->middleware('throttle:60,1')
    ->name('contact.store');

Route::get('/dashboard', [AdminDashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// ADMIN (simple): semua user berstatus is_admin=true
Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('pages', App\Http\Controllers\Admin\PageController::class)->only(['index', 'edit', 'update']);
        Route::resource('posts', App\Http\Controllers\Admin\PostController::class);
        Route::resource('events', App\Http\Controllers\Admin\EventController::class);
        Route::resource('albums', App\Http\Controllers\Admin\AlbumController::class);
        Route::post('albums/{album}/media', [App\Http\Controllers\Admin\AlbumMediaController::class, 'store'])->name('albums.media.store');
        Route::delete('albums/{album}/media/{media}', [App\Http\Controllers\Admin\AlbumMediaController::class, 'destroy'])->name('albums.media.destroy');
        Route::resource('vocational-programs', App\Http\Controllers\Admin\VocationalProgramController::class);
        Route::delete('vocational-programs/{vocational_program}/media/{media}', [App\Http\Controllers\Admin\VocationalProgramController::class, 'deleteMedia'])->name('vocational-programs.media.destroy');
        Route::resource('media', App\Http\Controllers\Admin\MediaItemController::class)->only(['store', 'destroy']);
        Route::get('settings', [App\Http\Controllers\Admin\SettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
        Route::get('contacts', [App\Http\Controllers\Admin\ContactMessageController::class, 'index'])->name('contacts.index');
        Route::get('contacts/{id}', [App\Http\Controllers\Admin\ContactMessageController::class, 'show'])->name('contacts.show');
        Route::post('contacts/{id}/mark', [App\Http\Controllers\Admin\ContactMessageController::class, 'mark'])->name('contacts.mark');
    });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';







