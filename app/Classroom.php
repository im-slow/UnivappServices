<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $table = 'classrooms';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'floor', 'directions', 'capacity', 'accessibility'];

    protected $hidden = ['marker_id', 'building_id', 'created_at', 'updated_at'];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id');
    }

    public function lesson()
    {
        return $this->hasMany(Lesson::class);
    }

    public function marker()
    {
        return $this->belongsTo(Marker::class, 'marker_id');
    }
}
