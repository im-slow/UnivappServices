<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'services';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description'];

    public function role()
    {
        return $this->belongsToMany(Role::class)
            ->using(ServiceRole::class)
            ->withPivot(ServiceRole::class)
            ->withTimestamps();
    }

}
