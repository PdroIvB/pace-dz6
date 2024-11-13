<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'owner_id',
    ];

    public function owner ()
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function columns ()
    {
        return $this->hasMany(Column::class)->orderBy('sequence');
    }
    
    public function participants ()
    {
        return $this->hasManyThrough(User::class, Permission::class, 'user_id', 'id');
    }

    public function tasks ()
    {
        return $this->hasManyThrough(Task::class, Column::class);
    }

    public function permissions ()
    {
        return $this->hasMany(Permission::class);
    }
}
