<?php

use App\Models\Destination;
use Database\Seeders\DestinationSeeder;

beforeEach(function () {
    $this->seed(DestinationSeeder::class);
});

test('gallery api returns images of published destinations only', function () {
    $hidden = Destination::first();
    $hidden->update(['is_published' => false]);

    $response = $this->getJson('/api/v1/gallery')->assertOk()
        ->assertJsonStructure(['data' => ['*' => ['id', 'title', 'category', 'image']]]);

    expect(collect($response->json('data'))->pluck('title'))->not->toContain($hidden->name);
});

test('gallery page receives dynamic items', function () {
    $this->get(route('gallery.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Gallery/Index')->has('galleryItems'));
});

test('contact info and hero stats come from real data', function () {
    $this->getJson('/api/v1/contact-info')->assertJsonPath('data.agency_name', config('pariwisata.contact.agency_name'));

    $this->get(route('home'))->assertOk();
});
