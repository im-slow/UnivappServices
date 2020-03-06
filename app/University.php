<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $table = 'universities';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'country', 'district', 'city'];

    public function user() {
        return $this->hasMany(User::class);
    }

    public function department() {
        return $this->hasMany(Departments::class);
    }

    public function university() {
        return $this->hasMany(Room::class);
    }
}
