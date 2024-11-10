<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Workspace;
use App\Services\ColumnReorderingService;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    protected $reorderingService;

    public function __construct(ColumnReorderingService $reorderingService)
    {
        $this->reorderingService = $reorderingService;
    }

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

    public function updateSequence(Request $request, Workspace $workspace, Column $column)
    {
        $validated = $request->validate([
            'new_sequence' => 'required|integer|min:1',
        ]);

        try {
            $this->reorderingService->reorderColumn(
                $column,
                $validated['new_sequence'],
                $workspace->id
            );

            return response()->json(['message' => 'Column reordered successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reorder column'], 500);
        }
    }
}
