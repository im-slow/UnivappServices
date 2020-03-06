<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    // Stanza messaggi
    protected $table = 'rooms';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['type', 'name', 'description'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['room_type_id', 'university_id', 'created_at', 'updated_at'];

    public function university() {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function roomtype() {
        return $this->belongsTo(RoomType::class, 'room_type_id');
    }

    public function user()
    {
        return $this->belongsToMany(User::class)
            ->using(RoomUser::class)
            ->withPivot(RoomUser::class)
            ->withTimestamps();
    }
}
