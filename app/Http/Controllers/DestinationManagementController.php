<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Destination;
use App\Models\DestinationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DestinationManagementController extends Controller
{
    /**
     * Display a listing of the destinations for management.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Destination::with(['category', 'images']);

        if ($user->role === 'business') {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'published') {
                $query->where('is_published', true);
            } elseif ($request->status === 'draft') {
                $query->where('is_published', false);
            }
        }

        $destinations = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Destinations/Manage/Index', [
            'destinations' => $destinations,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new destination.
     */
    public function create()
    {
        $categories = Category::all(['id', 'name', 'slug']);

        return Inertia::render('Destinations/Manage/Form', [
            'categories' => $categories,
            'destination' => null,
        ]);
    }

    /**
     * Store a newly created destination in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'location' => 'nullable|string|max:255',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'is_published' => 'boolean',
            'image_url' => 'nullable|string|url',
            'image' => 'nullable|image|max:3072',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Destination::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $destination = Destination::create([
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'] ?? null,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'location' => $validated['location'] ?? null,
            'opening_time' => $validated['opening_time'] ?? null,
            'closing_time' => $validated['closing_time'] ?? null,
            'is_published' => $request->boolean('is_published', true),
            'rating' => 0,
        ]);

        // Handle Image
        $finalImageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $finalImageUrl = '/storage/' . $path;
        } elseif (!empty($validated['image_url'])) {
            $finalImageUrl = $validated['image_url'];
        }

        if ($finalImageUrl) {
            DestinationImage::create([
                'destination_id' => $destination->id,
                'image_url' => $finalImageUrl,
                'is_primary' => true,
            ]);
        }

        return redirect()->route('manage.destinations.index')->with('success', 'Destinasi wisata berhasil ditambahkan!');
    }

    /**
     * Show the form for editing the specified destination.
     */
    public function edit(Request $request, Destination $destination)
    {
        $this->authorizeAccess($request->user(), $destination);

        $destination->load(['category', 'images']);
        $categories = Category::all(['id', 'name', 'slug']);

        return Inertia::render('Destinations/Manage/Form', [
            'categories' => $categories,
            'destination' => $destination,
        ]);
    }

    /**
     * Update the specified destination in storage.
     */
    public function update(Request $request, Destination $destination)
    {
        $this->authorizeAccess($request->user(), $destination);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'location' => 'nullable|string|max:255',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'is_published' => 'boolean',
            'image_url' => 'nullable|string|url',
            'image' => 'nullable|image|max:3072',
        ]);

        if ($destination->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;
            while (Destination::where('slug', $slug)->where('id', '!=', $destination->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $destination->slug = $slug;
        }

        $destination->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'] ?? null,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'location' => $validated['location'] ?? null,
            'opening_time' => $validated['opening_time'] ?? null,
            'closing_time' => $validated['closing_time'] ?? null,
            'is_published' => $request->boolean('is_published', false),
        ]);

        // Handle Image
        $finalImageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $finalImageUrl = '/storage/' . $path;
        } elseif (!empty($validated['image_url'])) {
            $finalImageUrl = $validated['image_url'];
        }

        if ($finalImageUrl) {
            $destination->images()->update(['is_primary' => false]);
            DestinationImage::create([
                'destination_id' => $destination->id,
                'image_url' => $finalImageUrl,
                'is_primary' => true,
            ]);
        }

        return redirect()->route('manage.destinations.index')->with('success', 'Destinasi wisata berhasil diperbarui!');
    }

    /**
     * Remove the specified destination from storage.
     */
    public function destroy(Request $request, Destination $destination)
    {
        $this->authorizeAccess($request->user(), $destination);

        $destination->delete();

        return redirect()->route('manage.destinations.index')->with('success', 'Destinasi wisata berhasil dihapus!');
    }

    /**
     * Toggle published status.
     */
    public function togglePublish(Request $request, Destination $destination)
    {
        $this->authorizeAccess($request->user(), $destination);

        $destination->update([
            'is_published' => !$destination->is_published,
        ]);

        return back()->with('success', 'Status publikasi destinasi berhasil diubah!');
    }

    protected function authorizeAccess($user, Destination $destination): void
    {
        if ($user->role === 'admin') {
            return;
        }

        if ($user->role === 'business' && $destination->user_id === $user->id) {
            return;
        }

        abort(403, 'Anda tidak memiliki hak akses untuk destinasi ini.');
    }
}
