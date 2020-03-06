<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RoomUser extends Pivot
{
    // Piovt appartenenza ad una stanza
    protected $table = 'room_user';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['archived'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['user_id', 'room_id', 'created_at', 'updated_at'];
}
