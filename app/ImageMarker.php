<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ImageMarker extends Pivot
{
    protected $table = 'image_marker';
    protected $primaryKey = 'id';

    protected $guarded = ['image_id', 'marker_id'];

    // The attributes that should be hidden for arrays.
    protected $hidden = ['created_at', 'updated_at'];

}
