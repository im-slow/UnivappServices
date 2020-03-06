<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassroomUser extends Model
{
    protected $table = 'desk_user';
    protected $primaryKey = 'id';

    protected $fillable = ['date', 'start_time', 'end_time', 'description', 'end'];

    protected $guarded = ['user_id', 'classroom_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];

}
