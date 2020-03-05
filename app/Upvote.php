<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Upvote extends Pivot
{
    protected $table = 'upvote';
    protected $primaryKey = 'id';

    protected $guarded = ['user_id', 'note_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
