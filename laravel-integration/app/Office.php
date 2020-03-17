<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $table = 'offices';
    protected $primaryKey = 'id';

    protected $fillable = ['floor', 'number', 'description'];

    protected $hidden = ['marker_id', 'building_id' ,'created_at', 'updated_at'];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id');
    }

    public function marker() {
        return $this->belongsTo(Marker::class, 'marker_id');
    }

    public function teacher()
    {
        return $this->hasMany(Teacher::class);
    }
}
