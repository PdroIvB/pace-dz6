<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Column extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'workspace_id',
        'owner_id',
        'sequence',
    ];

    public function workspace ()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function tasks ()
    {
        return $this->hasMany(Task::class)->orderBy('sequence');
    }

    public function user ()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

        /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function (Column $column) {
            if (is_null($column->sequence)) {
                $column->sequence = static::getNextSequence($column->workspace_id);
            }
        });
    }

        /**
     * Get the next sequence number for a given column
     */
    public static function getNextSequence($workspaceId)
    {
        return DB::transaction(function () use ($workspaceId) {
            $maxSequence = static::where('workspace_id', $workspaceId)
                ->lockForUpdate()
                ->max('sequence');

            return ($maxSequence ?? 0) + 1;
        });
    }
}
