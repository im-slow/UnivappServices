<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{

    protected $table = 'teachers';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['office_address', 'office_hours', 'phone'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];

    public function subject()
    {
        return $this->belongsToMany(Subject::class)
            ->using(SubjectTeacher::class)
            ->withPivot(SubjectTeacher::class)
            ->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }
}
