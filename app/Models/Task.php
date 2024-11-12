<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sequence',
        'column_id',
        'description',
        'assignee_id',
    ];

    public function assignee ()
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function column ()
    {
        return $this->belongsTo(Column::class);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function (Task $task) {
            if (is_null($task->sequence)) {
                $task->sequence = static::getNextSequence($task->column_id);
            }
        });
    }

        /**
     * Get the next sequence number for a given column
     */
    public static function getNextSequence($columnId)
    {
        return DB::transaction(function () use ($columnId) {
            $maxSequence = static::where('column_id', $columnId)
                ->lockForUpdate()
                ->max('sequence');

            return ($maxSequence ?? 0) + 1;
        });
    }
}
