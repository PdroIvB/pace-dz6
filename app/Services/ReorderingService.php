<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ReorderingService
{
    /**
     * Reorder a model to a new sequence position
     *
     * @param string $modelClass The class of the model (e.g., Column::class or Task::class)
     * @param int|Model $modelId The ID of the model to move
     * @param int $newSequence The new sequence number for the model
     * @param string $scopeKey The name of the foreign key field for scoping (e.g., 'workspace_id' or 'column_id')
     * @param int $scopeId The ID to scope the reordering
     * @return bool
     */
    public function reorder(string $modelClass, int|Model $modelId, int $newSequence, string $scopeKey, int $scopeId): bool
    {
        try {
            DB::beginTransaction();

            if ($modelId instanceof Model) {
                $model = $modelId;
            } else {
                $model = $modelClass::where($scopeKey, $scopeId)->findOrFail($modelId);
            }


            $oldSequence = $model->sequence;

            // If moving to the same position, no need to proceed
            if ($oldSequence === $newSequence) {
                DB::commit();
                return true;
            }

            // Moving model forward (e.g., from 3 to 1)
            if ($newSequence < $oldSequence) {
                $modelClass::where($scopeKey, $scopeId)
                    ->where('sequence', '>=', $newSequence)
                    ->where('sequence', '<', $oldSequence)
                    ->increment('sequence');
            }
            // Moving model backward (e.g., from 1 to 3)
            else {
                $modelClass::where($scopeKey, $scopeId)
                    ->where('sequence', '>', $oldSequence)
                    ->where('sequence', '<=', $newSequence)
                    ->decrement('sequence');
            }

            // Update the moved model's sequence
            $model->sequence = $newSequence;
            $model->save();

            DB::commit();
            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Reset and normalize all sequence numbers in a given scope
     *
     * @param string $modelClass The class of the model (e.g., Column::class or Task::class)
     * @param string $scopeKey The name of the foreign key field for scoping (e.g., 'workspace_id' or 'column_id')
     * @param int $scopeId The ID to scope the normalization
     * @return void
     */
    public function normalizeSequences(string $modelClass, string $scopeKey, int $scopeId): void
    {
        $models = $modelClass::where($scopeKey, $scopeId)
                        ->orderBy('sequence')
                        ->get();

        DB::beginTransaction();
        try {
            foreach ($models as $index => $model) {
                $model->sequence = $index + 1;
                $model->save();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    /**
     * Move a task to a new column and sequence position.
     *
     * @param int|Task $taskId The ID of the task to move
     * @param int $sourceColumnId The ID of the source column
     * @param int $targetColumnId The ID of the target column
     * @param int $newSequence The new sequence number in the target column
     * @return bool
     */
    public function moveTaskBetweenColumns(int|Task $taskId, int $sourceColumnId, int $targetColumnId, int $newSequence): bool
    {
        try {
            DB::beginTransaction();

            // Retrieve the task to move
            $task = $taskId instanceof Task ? $taskId : Task::where('column_id', $sourceColumnId)->findOrFail($taskId);

            // Step 1: Update the task's column ID to the target column
            $task->column_id = $targetColumnId;
            $task->save();

            // Step 2: Reorder tasks in the target column to accommodate the moved task
            $this->reorder(Task::class, $task->id, $newSequence, 'column_id', $targetColumnId);

            // Step 3: Reorder tasks in the source column to fill the gap
            $this->normalizeSequences(Task::class, 'column_id', $sourceColumnId);

            DB::commit();
            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
