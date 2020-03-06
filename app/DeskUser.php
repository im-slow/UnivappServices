<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeskUser extends Pivot
{
    protected $table = 'desk_user';
    protected $primaryKey = 'id';

    protected $fillable = ['date', 'start_time', 'end_time', 'check', 'seat', 'break_start_time'];

    protected $guarded = ['user_id', 'desk_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];


}
