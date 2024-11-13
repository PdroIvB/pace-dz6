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

        return Inertia::render('Authenticated/Workspace/Index', compact('workspace'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Workspace $workspace)
    {
        $request->validate([
            'name' => 'required|string|min:3'
        ]);

        $workspace->update(['name' => $request->name]);

        return response()->json(compact('workspace'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return response()->json(['message' => "Área de Trabalho excluída"], 204);
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
