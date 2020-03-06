<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Messagge extends Model
{
    protected $table = 'messagges';
    protected $primaryKey = 'id';

    protected $fillable = ['text', 'important', 'seen'];

    protected $hidden = ['user_id', 'room_id', 'created_at', 'updated_at'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function room() {
        return $this->belongsTo(Room::class, 'room_id');
    }

}
