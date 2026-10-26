<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * List approved reviews of a published destination.
     */
    public function index(Request $request, string $slug): JsonResponse
    {
        $destination = Destination::published()->where('slug', $slug)->firstOrFail();

        $reviews = $destination->reviews()
            ->approved()
            ->with('user:id,name')
            ->latest()
            ->paginate(max(1, min((int) $request->get('limit', 10), 50)));

        return response()->json([
            'status' => 'success',
            'message' => 'Reviews retrieved successfully',
            'data' => $reviews->getCollection()->map(fn (Review $review) => [
                'id' => $review->id,
                'user' => $review->user?->name,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at?->toIso8601String(),
            ])->values(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }
}
