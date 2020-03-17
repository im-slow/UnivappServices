<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ReportMessage extends Pivot
{
    protected $table = 'report_message';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['title', 'description'];

    protected $guarded = ['user_id', 'message_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
