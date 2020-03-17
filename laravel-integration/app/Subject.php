<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $table = 'subjects';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['name', 'code', 'CFU', 'semester', 'language'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];

    public function faculty()
    {
        return $this->belongsToMany(Faculty::class)
            ->using(SubjectFaculty::class)
            ->withPivot(SubjectFaculty::class)
            ->withTimestamps();
    }

    public function teacher()
    {
        return $this->belongsToMany(Teacher::class)
            ->using(SubjectTeacher::class)
            ->withPivot(SubjectTeacher::class)
            ->withTimestamps();
    }

    public function lesson()
    {
        return $this->belongsToMany(Lesson::class)
            ->using(SubjectLesson::class)
            ->withPivot(SubjectLesson::class)
            ->withTimestamps();
    }

    public function student()
    {
        return $this->belongsToMany(Student::class)
            ->using(SubjectStudent::class)
            ->withPivot(SubjectStudent::class)
            ->withTimestamps();
    }

    public function page()
    {
        return $this->hasMany(Page::class);
    }
}
