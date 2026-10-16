<?php

use App\Models\Category;
use App\Models\Destination;
use Database\Seeders\DestinationSeeder;

beforeEach(function () {
    $this->seed(DestinationSeeder::class);
});

test('api returns destination list successfully', function () {
    $response = $this->getJson('/api/v1/destinations');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Destinations retrieved successfully',
        ])
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'slug', 'category', 'price', 'rating']
            ]
        ]);
});

test('api can filter destinations by search query', function () {
    $response = $this->getJson('/api/v1/destinations?search=Krakatau');

    $response->assertStatus(200)
        ->assertJsonFragment(['slug' => 'gunung-anak-krakatau']);
});

test('api can filter destinations by category', function () {
    $response = $this->getJson('/api/v1/destinations?category=bahari');

    $response->assertStatus(200)
        ->assertJsonFragment(['slug' => 'pulau-pahawang']);
});

test('api returns destination detail by slug', function () {
    $response = $this->getJson('/api/v1/destinations/pulau-pahawang');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'data' => [
                'slug' => 'pulau-pahawang',
                'name' => 'Pulau Pahawang',
            ]
        ]);
});

test('api returns destination detail by uuid', function () {
    $dest = Destination::first();

    $response = $this->getJson("/api/v1/destinations/{$dest->id}");

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'data' => [
                'id' => $dest->id,
                'slug' => $dest->slug,
            ]
        ]);
});

test('api returns standardized 404 error when destination not found', function () {
    $response = $this->getJson('/api/v1/destinations/destinasi-fiktif-123');

    $response->assertStatus(404)
        ->assertJson([
            'status' => 'error',
            'message' => 'Endpoint atau data destinasi tidak ditemukan.',
            'data' => null,
        ]);
});

test('api returns category list successfully', function () {
    $response = $this->getJson('/api/v1/categories');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
        ])
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'slug']
            ]
        ]);
});
