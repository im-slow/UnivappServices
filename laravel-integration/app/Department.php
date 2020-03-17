<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description'];

    protected $hidden = ['university_id', 'created_at', 'updated_at'];

    public function faculty()
    {
        return $this->hasMany(Faculty::class);
    }

    public function university()
    {
        return $this->hasOne(University::class, 'university_id');
    }
}
