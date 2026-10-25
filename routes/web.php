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
})->name('home');

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

Route::get('/destinations/{destination:slug}', function (string $slug) {
    $destination = Destination::where('slug', $slug)->with(['category', 'images'])->first();
    
    if (!$destination) {
        // Fallback for static/mock data that doesn't exist in DB yet
        $destination = new Destination([
            'name' => str_replace('-', ' ', ucwords($slug, '-')),
            'slug' => $slug,
            'description' => 'Deskripsi lengkap destinasi ini akan segera hadir. Lampung memiliki sejuta pesona alam yang menanti untuk Anda jelajahi.',
            'price' => 50000,
            'rating' => 4.8,
            'location' => 'Provinsi Lampung'
        ]);
    }

    // Mocking additional details for the new page structure
    $destination->tagline = 'Destinasi Wisata Unggulan Lampung';
    $destination->opening_hours = '08:00 - 17:00 WIB';
    $destination->facilities = ['Area Parkir', 'Toilet Umum', 'Mushola', 'Spot Foto'];
    $destination->tips = [
        'Gunakan pakaian yang nyaman',
        'Bawa kamera untuk mengabadikan momen',
        'Jaga kebersihan lingkungan sekitar',
        'Patuhi protokol kesehatan dan aturan lokal'
    ];

    return Inertia::render('Destinations/Show/Index', [
        'destination' => $destination,
    ]);
})->name('destinations.show');

Route::get('/gallery', function () {
    return Inertia::render('Gallery/Index');
})->name('gallery.index');

Route::get('/testimonials', function () {
    return Inertia::render('Testimonials/Index');
})->name('testimonials.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Protected Routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/validasi-mitra', [BusinessValidationController::class, 'index'])->name('admin.business-validation.index');
        Route::patch('/admin/validasi-mitra/{user}', [BusinessValidationController::class, 'updateStatus'])->name('admin.business-validation.update');

        Route::get('/admin/destinasi', [\App\Http\Controllers\Admin\DestinationManagementController::class, 'index'])->name('admin.destinations.index');
        Route::post('/admin/destinasi', [\App\Http\Controllers\Admin\DestinationManagementController::class, 'store'])->name('admin.destinations.store');
        Route::put('/admin/destinasi/{destination}', [\App\Http\Controllers\Admin\DestinationManagementController::class, 'update'])->name('admin.destinations.update');
        Route::delete('/admin/destinasi/{destination}', [\App\Http\Controllers\Admin\DestinationManagementController::class, 'destroy'])->name('admin.destinations.destroy');
    });
});

require __DIR__.'/auth.php';
