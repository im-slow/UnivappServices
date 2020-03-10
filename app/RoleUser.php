<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RoleUser extends Pivot
{
    protected $table = 'role_users';
    protected $primaryKey = 'id';

    protected $guarded = ['role_id', 'user_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
