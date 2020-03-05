<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Marker extends Model
{
    protected $table = 'markers';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'address', 'lat', 'lng', 'type', 'important'];

    protected $hidden = ['created_at', 'updated_at'];

    public function office()
    {
        return $this->hasOne(Office::class);
    }

    public function classroom()
    {
        return $this->hasOne(Classroom::class);
    }

    public function building()
    {
        return $this->hasOne(Building::class);
    }
}
