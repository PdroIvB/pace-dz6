<?php

namespace Database\Factories;

use App\Models\Column;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'column_id' => Column::factory(),
            'name' => $this->faker->sentence(4),
            'sequence' => $this->faker->numberBetween(1, 10),
            'description' => $this->faker->paragraph(),
            'assignee_id' => $this->faker->boolean(80) ? User::factory() : null, // 80% chance of having an assignee
        ];
    }
}
