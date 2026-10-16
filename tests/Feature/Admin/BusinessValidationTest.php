<?php

use App\Models\User;

test('guests are redirected to login when visiting admin validation page', function () {
    $response = $this->get('/admin/validasi-mitra');

    $response->assertRedirect('/login');
});

test('regular users cannot access admin validation page', function () {
    $user = User::factory()->create([
        'role' => 'user',
    ]);

    $response = $this->actingAs($user)->get('/admin/validasi-mitra');

    $response->assertStatus(403);
});

test('mitra business owners cannot access admin validation page', function () {
    $mitra = User::factory()->create([
        'role' => 'business_owner',
        'validation_status' => 'approved',
    ]);

    $response = $this->actingAs($mitra)->get('/admin/validasi-mitra');

    $response->assertStatus(403);
});

test('admin can view business validation page', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin)->get('/admin/validasi-mitra');

    $response->assertStatus(200);
});

test('admin can approve business owner validation', function () {
    \Illuminate\Support\Facades\Notification::fake();

    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $partner = User::factory()->create([
        'role' => 'business_owner',
        'validation_status' => 'pending',
    ]);

    $response = $this->actingAs($admin)
        ->patch("/admin/validasi-mitra/{$partner->id}", [
            'status' => 'approved',
        ]);

    $response->assertSessionHas('success');
    expect($partner->fresh()->validation_status)->toBe('approved');
    \Illuminate\Support\Facades\Notification::assertSentTo($partner, \App\Notifications\PartnerValidationNotification::class);
});

test('admin can reject business owner validation with reason', function () {
    \Illuminate\Support\Facades\Notification::fake();

    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $partner = User::factory()->create([
        'role' => 'business_owner',
        'validation_status' => 'pending',
    ]);

    $response = $this->actingAs($admin)
        ->patch("/admin/validasi-mitra/{$partner->id}", [
            'status' => 'rejected',
            'rejection_reason' => 'Dokumen izin usaha belum lengkap.',
        ]);

    $response->assertSessionHas('success');
    expect($partner->fresh()->validation_status)->toBe('rejected');
    expect($partner->fresh()->rejection_reason)->toBe('Dokumen izin usaha belum lengkap.');
    \Illuminate\Support\Facades\Notification::assertSentTo($partner, \App\Notifications\PartnerValidationNotification::class);
});
