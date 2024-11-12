<?php

namespace App\Services;

use App\Models\Workspace;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use Exception;

class WorkspaceService
{
    public function create(array $data)
    {
        try {
            return DB::transaction(function () use ($data) {

                $workspace = Workspace::create($data);

                $workspace->permissions()->create([
                    'can_read' => true,
                    'can_edit' => true,
                    'user_id' => $workspace->owner_id
                ]);

                return $workspace;
            });
        } catch (Exception $e) {
            throw $e;
        }
    }
}