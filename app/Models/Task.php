<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
