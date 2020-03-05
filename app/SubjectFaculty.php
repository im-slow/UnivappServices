<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubjectFaculty extends Pivot
{
    protected $table = 'subject_faculty';
    protected $primaryKey = 'id';

    protected $guarded = ['subject_id', 'faculty_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
