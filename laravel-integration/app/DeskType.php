<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeskType extends Model
{
    protected $table = 'desks';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'seats_number', 'draw'];

    protected $hidden = ['created_at', 'updated_at'];

    public function desk()
    {
        return $this->hasMany(Desk::class);
    }

}
