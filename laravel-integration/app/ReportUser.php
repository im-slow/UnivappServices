<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ReportUser extends Pivot
{
    protected $table = 'report_user';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['title', 'description'];

    protected $guarded = ['reported_user_id', 'user_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
