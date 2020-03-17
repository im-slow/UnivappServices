<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $table = 'faculties';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description', 'code', 'type'];

    protected $hidden = ['department_id', 'created_at', 'updated_at'];

    public function department()
    {
        return $this->hasOne(Department::class, 'department_id');
    }

    public function subject()
    {
        return $this->belongsToMany(Subject::class)
            ->using(SubjectFaculty::class)
            ->withPivot(SubjectFaculty::class)
            ->withTimestamps();
    }

    public function student()
    {
        return $this->hasMany(Student::class);
    }

    public function teacher()
    {
        return $this->hasMany(Teacher::class);
    }
}
