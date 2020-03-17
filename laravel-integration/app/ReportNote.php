<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ReportNote extends Pivot
{
    protected $table = 'report_note';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['title', 'description'];

    protected $guarded = ['user_id', 'note_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
