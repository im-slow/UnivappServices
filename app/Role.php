<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->using(RoleUser::class)
            ->withPivot(RoleUser::class)
            ->withTimestamps();
    }

    public function service()
    {
        return $this->belongsToMany(Service::class)
            ->using(ServiceRole::class)
            ->withPivot(ServiceRole::class)
            ->withTimestamps();
    }
}
