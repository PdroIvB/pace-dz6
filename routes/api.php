<?php

use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'transform.keys'])->group(function () {
    Route::put('/workspace/{workspace}', [WorkspaceController::class, 'update']);
    Route::delete('/workspace/{workspace}', [WorkspaceController::class, 'destroy']);

    Route::put('/workspace/{workspace}/column/{column}', [WorkspaceController::class, 'reorderColumns']);
    Route::put('/workspace/{workspace}/column/{column}/task/{task}', [ColumnController::class, 'reorderTasks']);
    Route::put('/workspace/{workspace}/column/{column}/task/{task}/move', [ColumnController::class, 'moveTask']);

    Route::post('/task', [TaskController::class, 'store']);

    Route::post('/column', [ColumnController::class, 'store']);
    Route::put('/column/{column}', [ColumnController::class, 'update']);
    Route::delete('/column/{column}', [ColumnController::class, 'destroy']);
});
