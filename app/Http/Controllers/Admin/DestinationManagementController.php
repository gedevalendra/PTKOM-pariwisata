<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Destination;
use App\Models\DestinationImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DestinationManagementController extends Controller
{
    /**
     * Display a listing of destinations for admin.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Destination::with(['category', 'images'])->latest();

        if ($search) {
            $operator = config('database.default') === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($search, $operator) {
                $q->where('name', $operator, "%{$search}%")
                    ->orWhere('location', $operator, "%{$search}%");
            });
        }

        $destinations = $query->paginate(10)->withQueryString();
        $categories = Category::all(['id', 'name', 'slug']);

        return Inertia::render('admin/Destinations', [
            'destinations' => $destinations,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created destination.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'rating' => 'nullable|numeric|between:0,5',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $count = 1;
        while (Destination::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-".(++$count);
        }

        $destination = Destination::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'location' => $validated['location'],
            'rating' => $validated['rating'] ?? 5.0,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $imageUrl = Storage::url($path);

            DestinationImage::create([
                'destination_id' => $destination->id,
                'image_url' => $imageUrl,
                'is_primary' => true,
            ]);
        }

        return back()->with('success', 'Destinasi wisata baru berhasil ditambahkan.');
    }

    /**
     * Update the specified destination.
     */
    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'rating' => 'nullable|numeric|between:0,5',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $destination->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'location' => $validated['location'],
            'rating' => $validated['rating'] ?? $destination->rating,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $imageUrl = Storage::url($path);

            // Replace previous primary images, removing their stored files
            $destination->images()->where('is_primary', true)->get()->each(function (DestinationImage $image) {
                $image->deleteStoredFile();
                $image->delete();
            });

            DestinationImage::create([
                'destination_id' => $destination->id,
                'image_url' => $imageUrl,
                'is_primary' => true,
            ]);
        }

        return back()->with('success', 'Data destinasi berhasil diperbarui.');
    }

    /**
     * Remove the specified destination from storage.
     */
    public function destroy(Destination $destination): RedirectResponse
    {
        $destination->delete();

        return back()->with('success', 'Destinasi wisata berhasil dihapus.');
    }
}
