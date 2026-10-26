<?php

namespace Database\Factories;

use App\Models\Destination;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'destination_id' => Destination::first()?->id,
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->sentence(12),
            'is_approved' => true,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['is_approved' => false]);
    }
}
