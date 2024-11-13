<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index ()
    {
        $workspaces = auth()->user()->workspaces
            ->load('columns', 'participants')
            ->loadCount('tasks');

        return Inertia::render('Authenticated/Dashboard', compact('workspaces'));
    }
}
