<?php

use App\Models\RegistrationToken;
use App\Models\User;

test('existing account can log in after registering a new account and logging out', function () {
    $old = User::factory()->create(['email' => 'lama@example.com', 'password' => 'password']);

    $this->post(route('registrasi.generate'), ['type' => 'user']);
    $token = RegistrationToken::first();

    $this->post(route('registrasi.store'), [
        'token' => $token->token,
        'name' => 'Akun Baru',
        'email' => 'baru@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    expect(User::where('email', 'baru@example.com')->first()->role)->toBe('user');

    $this->post(route('logout'))->assertRedirect('/');
    $this->assertGuest();

    $this->post(route('login'), ['email' => 'lama@example.com', 'password' => 'password'])
        ->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($old);
});

test('newly registered account can log in with its own password', function () {
    $this->post(route('registrasi.generate'), ['type' => 'user']);
    $token = RegistrationToken::first();

    $this->post(route('registrasi.store'), [
        'token' => $token->token,
        'name' => 'Akun Baru',
        'email' => 'baru@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);
    $this->post(route('logout'));

    $this->post(route('login'), ['email' => 'baru@example.com', 'password' => 'password123'])
        ->assertRedirect(route('dashboard'));
    $this->assertAuthenticated();
});
