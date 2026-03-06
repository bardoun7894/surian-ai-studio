<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Directorate>
 */
class DirectorateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) fake()->unique()->numberBetween(100, 999),
            'name_ar' => fake()->company(),
            'name_en' => fake()->company(),
            'description' => fake()->sentence(),
            'icon' => 'Building',
            'is_active' => true,
            'featured' => false,
        ];
    }
}
