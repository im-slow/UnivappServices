<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    protected $table = 'buildings';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description'];

    protected $hidden = ['marker_id', 'created_at', 'updated_at'];

    public function classroom()
    {
        return $this->hasMany(Classroom::class);
    }

    public function office()
    {
        return $this->hasMany(Office::class);
    }

    public function marker()
    {
        return $this->belongsTo(Marker::class, 'marker_id');
    }
}
