<?php

namespace App\Services;

use App\Models\Column;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;

class ColumnReorderingService
{
    /**
     * Reorder a column to a new sequence position
     *
     * @param int $columnId The ID of the column to move
     * @param int $newSequence The new sequence number for the column
     * @param int $workspaceId The workspace ID to scope the reordering
     * @return bool
     */
    public function reorderColumn(int|Column $columnId, int $newSequence, int $workspaceId): bool
    {
        try {
            DB::beginTransaction();

            if ($columnId instanceof Column) {
                $column = $columnId;
            } else {
                $column = Column::where('workspace_id', $workspaceId)
                                ->findOrFail($columnId);
            }

            $oldSequence = $column->sequence;

            // If moving to the same position, no need to proceed
            if ($oldSequence === $newSequence) {
                DB::commit();
                return true;
            }

            // Moving column forward (e.g., from 3 to 1)
            if ($newSequence < $oldSequence) {
                Column::where('workspace_id', $workspaceId)
                    ->where('sequence', '>=', $newSequence)
                    ->where('sequence', '<', $oldSequence)
                    ->increment('sequence');
            }
            // Moving column backward (e.g., from 1 to 3)
            else {
                Column::where('workspace_id', $workspaceId)
                    ->where('sequence', '>', $oldSequence)
                    ->where('sequence', '<=', $newSequence)
                    ->decrement('sequence');
            }

            // Update the moved column's sequence
            $column->sequence = $newSequence;
            $column->save();

            DB::commit();
            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Reset and normalize all sequence numbers in the workspace
     *
     * @param int $workspaceId
     * @return void
     */
    public function normalizeSequences(int $workspaceId): void
    {
        $columns = Column::where('workspace_id', $workspaceId)
                        ->orderBy('sequence')
                        ->get();

        DB::beginTransaction();
        try {
            foreach ($columns as $index => $column) {
                $column->sequence = $index + 1;
                $column->save();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}