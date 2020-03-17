<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'file_type', 'URI'];

    protected $hidden = ['created_at', 'updated_at'];


}
