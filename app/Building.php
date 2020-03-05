<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    protected $table = 'buildings';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'address'];

    protected $hidden = ['building_id', 'created_at', 'updated_at'];

    public function classroom()
    {
        return $this->hasMany(Classroom::class);
    }
}
