<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Downvote extends Pivot
{
    protected $table = 'downvote';
    protected $primaryKey = 'id';

    protected $guarded = ['user_id', 'note_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
