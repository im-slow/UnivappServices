<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'students';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['matric_no', 'course_year', 'supplementary_year'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['faculty_id', 'created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function faculty()
    {
        return $this->hasOne(Faculty::class, 'faculty_id');
    }

    public function subject()
    {
        return $this->belongsToMany(Subject::class)
            ->using(SubjectStudent::class)
            ->withPivot(SubjectStudent::class)
            ->withTimestamps();
    }

}
