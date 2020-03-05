<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TagNote extends Pivot
{
    protected $table = 'tag_note';
    protected $primaryKey = 'id';

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
