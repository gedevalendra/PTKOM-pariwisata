<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get list of all destination categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::select('id', 'name', 'slug', 'description')
            ->withCount('destinations')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Categories retrieved successfully',
            'data' => $categories,
        ]);
    }
}
