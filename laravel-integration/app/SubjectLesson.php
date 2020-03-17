<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SubjectLesson extends Pivot
{
    protected $table = 'subject_lesson';
    protected $primaryKey = 'id';

    protected $guarded = ['subject_id', 'lesson_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];
}
