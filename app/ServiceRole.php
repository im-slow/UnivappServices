<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceRole extends Pivot
{
    protected $table = 'services_roles';
    protected $primaryKey = 'id';

    protected $guarded = ['service_id', 'role_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
