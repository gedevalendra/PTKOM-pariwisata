<?php

use App\Http\Controllers\BusinessValidationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Category;
use App\Models\Destination;
use App\Models\SiteMetric;

Route::get('/', function () {
    $destinations = Destination::with(['category', 'images'])->latest()->get()->map(function ($dest) {
        $primaryImg = $dest->images->firstWhere('is_primary', true) ?? $dest->images->first();
        return [
            'id' => $dest->id,
            'title' => $dest->name,
            'slug' => $dest->slug,
            'category' => $dest->category?->name ?? 'Wisata',
            'location' => $dest->location ?? 'Lampung',
            'rating' => (float) $dest->rating,
            'reviewCount' => 215,
            'description' => $dest->description,
            'price' => 'Rp ' . number_format($dest->price, 0, ',', '.') . ' / orang',
            'image' => $primaryImg?->image_url ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        ];
    });

    $categories = Category::pluck('name');

    $metric = SiteMetric::latest('recorded_at')->first();
    $stats = $metric ? [
        ['value' => ($metric->active_users ?? 47) . '+', 'label' => 'DESTINASI WISATA'],
        ['value' => ($metric->total_visitors >= 1000000 ? str_replace('.0', '', number_format($metric->total_visitors / 1000000, 1, '.', '')) . 'jt' : '1.2jt'), 'label' => 'WISATAWAN/TAHUN'],
        ['value' => (string) (Category::count() ?: 9), 'label' => 'KATEGORI WISATA'],
        ['value' => '4.8★', 'label' => 'RATING RATA-RATA'],
    ] : null;

    return Inertia::render('Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'destinations' => $destinations,
        'categories' => $categories,
        'statistics' => $stats,
    ]);
});

Route::get('/destinations', function () {
    $destinations = Destination::with(['category', 'images'])->latest()->get()->map(function ($dest) {
        $primaryImg = $dest->images->firstWhere('is_primary', true) ?? $dest->images->first();
        return [
            'slug' => $dest->slug,
            'name' => $dest->name,
            'category' => $dest->category?->name ?? 'Wisata',
            'regency' => $dest->location ?? 'Provinsi Lampung',
            'duration' => '1–2 hari',
            'rating' => (float) $dest->rating,
            'reviewCount' => 1250,
            'priceMin' => (int) $dest->price,
            'priceMax' => null,
            'thumbnail' => $primaryImg?->image_url ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            'description' => $dest->description,
        ];
    });

    $categories = Category::pluck('name');

    return Inertia::render('Destinations/Index', [
        'destinations' => $destinations,
        'categories' => $categories,
    ]);
})->name('destinations.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Business Owner Validation for Admin
    Route::middleware('admin')->group(function () {
        Route::get('/admin/validasi-mitra', [BusinessValidationController::class, 'index'])->name('admin.business-validation.index');
        Route::patch('/admin/validasi-mitra/{user}', [BusinessValidationController::class, 'updateStatus'])->name('admin.business-validation.update');
    });
});

require __DIR__.'/auth.php';
