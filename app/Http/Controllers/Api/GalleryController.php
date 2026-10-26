<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GalleryController as WebGalleryController;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Gallery retrieved successfully',
            'data' => WebGalleryController::items(),
        ]);
    }
}
