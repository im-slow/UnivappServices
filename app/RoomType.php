<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    protected $table = 'room_types';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function room() {
        return $this->hasMany(Room::class);
    }
}
