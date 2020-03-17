<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $table = 'tags';
    protected $primaryKey = 'id';

    // The attributes that are mass assignable.
    protected $fillable = ['name'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];

    public function note()
    {
        return $this->belongsToMany(Note::class)
            ->using(TagNote::class)
            ->withPivot(TagNote::class)
            ->withTimestamps();
    }
}
