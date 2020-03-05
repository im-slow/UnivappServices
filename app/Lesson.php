<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $table = 'lessons';
    protected $primaryKey = 'id';

    protected $fillable = ['start_time', 'duration', 'week_day', 'start_date', 'end_date', 'capacity', 'accessibility'];

    protected $hidden = ['teaching_id', 'classroom_id', 'created_at', 'updated_at'];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function subject()
    {
        return $this->belongsToMany(Subject::class)
            ->using(SubjectLesson::class)
            ->withPivot(SubjectLesson::class)
            ->withTimestamps();
    }

}
