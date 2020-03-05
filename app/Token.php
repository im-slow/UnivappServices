<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    protected $table = 'tokens';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['number'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['user_id', 'created_at', 'updated_at'];

    public function user()
    {
        return $this->belongTo(User::class, 'user_id');
    }

}
