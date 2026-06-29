<?php

use App\Http\Controllers\RedirectController;
use App\Http\Controllers\ShortLinkController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Root redirect to login
Route::get('/', function () {
    return redirect()->to('/login');
});

// Explicit login route rendering
Route::middleware(['guest'])->group(function () {
    Route::get('/login', function () {
        return Inertia\Inertia::render('auth/login');
    })->name('login');
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [ShortLinkController::class, 'index'])->name('dashboard');
    Route::post('/links', [ShortLinkController::class, 'store'])->name('links.store');
    Route::patch('/links/{shortLink}', [ShortLinkController::class, 'update'])->name('links.update');
    Route::delete('/links/{shortLink}', [ShortLinkController::class, 'destroy'])->name('links.destroy');
    Route::put('/settings/password', [ShortLinkController::class, 'updatePassword'])->name('settings.password.update');
});

// Short URL redirect — must be last to avoid catching other routes
Route::get('/{slug}', [RedirectController::class, 'show'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->name('redirect');
