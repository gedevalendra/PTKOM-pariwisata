<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Http\Resources\DestinationResource;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::with(['category', 'images']);

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

        $destinations = $query->paginate($request->get('limit', 10));

        return DestinationResource::collection($destinations)->additional([
            'status' => 'success',
            'message' => 'Destinations retrieved successfully'
        ]);
    }

    public function show($identifier)
    {
        $destination = Destination::with(['category', 'images'])
            ->where('slug', $identifier)
            ->orWhere('id', $identifier)
            ->firstOrFail();
        
        return (new DestinationResource($destination))->additional([
            'status' => 'success',
            'message' => 'Destination detail retrieved successfully'
        ]);
    }
}
