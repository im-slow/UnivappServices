<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $table = 'pages';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description'];

    protected $hidden = ['user_id', 'subject_id', 'created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function note()
    {
        return $this->hasMany(Note::class, 'page_id');
    }
}
