<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Task;
use App\Models\Workspace;
use App\Services\ReorderingService;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    public function __construct(
        protected ReorderingService $reorderingService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Column $column)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Column $column)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Column $column)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Column $column)
    {
        //
    }

    public function reorderTasks (Request $request, Workspace $workspace, Column $column, Task $task)
    {
        $validated = $request->validate([
            'new_sequence' => 'required|integer|min:1',
        ]);

        try {
            $this->reorderingService->reorder(Task::class, $task, $validated['new_sequence'], 'column_id', $column->id);

            return response()->json(['message' => 'Task reordered successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reorder task'], 500);
        }
    }

    public function moveTask (Request $request, Workspace $workspace, Column $column, Task $task)
    {
        $validated = $request->validate([
            'new_sequence' => 'required|integer|min:1',
            'destination_column_id' => 'required|integer|exists:columns,id'
        ]);

        try {
            $this->reorderingService->moveTaskBetweenColumns($task, $column->id, $validated['destination_column_id'], $validated['new_sequence']);

            return response()->json(['message' => 'Task reordered successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reorder task'], 500);
        }
    }
}