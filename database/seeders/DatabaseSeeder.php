<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Column;
use App\Models\Permission;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $workspaces = Workspace::factory(5)
            ->create([
                'owner_id' => $users->random()->id
            ]);

        $workspaces->each(function ($workspace) {
            Column::factory(fake()->numberBetween(3, 6))
                ->create([
                    'workspace_id' => $workspace->id
                ]);
        });

        $workspaces->each(function ($workspace) use ($users) {
            $users->each(function ($user) use ($workspace) {
                if (fake()->boolean(70)) { // 70% chance of user having access to workspace
                    Permission::factory()->create([
                        'workspace_id' => $workspace->id,
                        'user_id' => $user->id
                    ]);
                }
            });
        });

        Column::all()->each(function ($column) use ($users) {
            Task::factory(fake()->numberBetween(3, 8))
                ->create([
                    'column_id' => $column->id,
                    'assignee_id' => $users->random()->id
                ]);
        });
    }
}
