<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationResource;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::published()->with(['category', 'images']);

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $operator = config('database.default') === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($search, $operator) {
                $q->where('name', $operator, "%{$search}%")
                    ->orWhere('description', $operator, "%{$search}%")
                    ->orWhere('location', $operator, "%{$search}%");
            });
        }

        $destinations = $query->paginate(max(1, min((int) $request->get('limit', 10), 50)));

        return DestinationResource::collection($destinations)->additional([
            'status' => 'success',
            'message' => 'Destinations retrieved successfully',
        ]);
    }

    public function show($identifier)
    {
        $destination = Destination::published()->with(['category', 'images'])
            ->where(function ($query) use ($identifier) {
                $query->where('slug', $identifier);

                if (Str::isUuid($identifier)) {
                    $query->orWhere('id', $identifier);
                }
            })
            ->firstOrFail();

        return (new DestinationResource($destination))->additional([
            'status' => 'success',
            'message' => 'Destination detail retrieved successfully',
        ]);
    }
}
