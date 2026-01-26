<?php

namespace Database\Factories;

use App\Models\Directorate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SubDirectorate>
 */
class SubDirectorateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'parent_directorate_id' => Directorate::factory(),
            'name_ar' => fake()->company(),
            'name_en' => fake()->company(),
            'url' => fake()->url(),
            'is_external' => false,
            'order' => fake()->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
