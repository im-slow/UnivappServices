<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchasedNote extends Pivot
{
    protected $table = 'purchased_note';
    protected $primaryKey = 'id';

    protected $guarded = ['user_id', 'note_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
