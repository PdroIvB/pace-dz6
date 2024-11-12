<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateWorkspaceRequest;
use App\Models\Column;
use App\Models\Workspace;
use App\Services\ReorderingService;
use App\Services\WorkspaceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function __construct(
        protected ReorderingService $reorderingService,
        protected WorkspaceService $workspaceService,
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
    public function store(CreateWorkspaceRequest $request)
    {
        try {
            $workspace = $this->workspaceService->create($request->validated());

            return redirect()->route('workspace.show', [$workspace]);

        } catch (\Throwable $th) {

            return redirect()->back()
                ->with('error', 'Falha ao criar Área de Trabalho');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace)
    {
        $workspace->load('columns.tasks');

        return Inertia::render('Workspace/Index', compact('workspace'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Workspace $workspace)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Workspace $workspace)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace)
    {
        //
    }

    public function reorderColumns(Request $request, Workspace $workspace, Column $column)
    {
        $validated = $request->validate([
            'new_sequence' => 'required|integer|min:1',
        ]);

        try {
            $this->reorderingService->reorder(Column::class, $column, $validated['new_sequence'], 'workspace_id', $workspace->id);

            return response()->json(['message' => 'Column reordered successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reorder column'], 500);
        }
    }
}
