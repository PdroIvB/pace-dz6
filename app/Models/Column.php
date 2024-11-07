<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sequence',
        'workspace_id'
    ];

    public function workspace ()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function tasks ()
    {
        return $this->hasMany(Task::class);
    }
}
