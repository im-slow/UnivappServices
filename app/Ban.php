<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Ban extends Pivot
{
    protected $table = 'ban';
    protected $primaryKey = 'id';

    protected $fillable = ['description', 'duration', 'type']; // TODO il tipo indica a quale servizio non può accedere

    protected $guarded = ['banned_user_id', 'user_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
