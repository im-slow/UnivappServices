<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Desk extends Model
{
    protected $table = 'desks';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'orientation', 'position_x', 'position_y'];

    protected $hidden = ['desktype_id','classroom_id', 'created_at', 'updated_at'];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    public function desktype()
    {
        return $this->belongsTo(DeskType::class, 'desktype_id');
    }

    public function user()
    {
        return $this->belongsToMany(User::class)
            ->using(DeskUser::class)
            ->withPivot(DeskUser::class)
            ->withTimestamps();
    }
}
