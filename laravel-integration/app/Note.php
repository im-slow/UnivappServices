<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $table = 'notes';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'file_type', 'description', 'lang', 'URI'];

    protected $guarded = ['token_price'];

    protected $hidden = ['page_id', 'created_at', 'updated_at'];

    public function page()
    {
        return $this->belongsTo(Page::class, 'page_id');
    }

    public function purchasednote()
    {
        return $this->belongsToMany(User::class)
            ->using(PurchasedNote::class)
            ->withPivot(PurchasedNote::class)
            ->withTimestamps();
    }

    public function upvote()
    {
        return $this->belongsToMany(User::class)
            ->using(Upvote::class)
            ->withPivot(Upvote::class)
            ->withTimestamps();
    }

    public function downvote()
    {
        return $this->belongsToMany(User::class)
            ->using(Downvote::class)
            ->withPivot(Downvote::class)
            ->withTimestamps();
    }

    public function tag()
    {
        return $this->belongsToMany(Tag::class)
            ->using(TagNote::class)
            ->withPivot(TagNote::class)
            ->withTimestamps();
    }

    public function reportnote()
    {
        return $this->belongsToMany(User::class)
            ->using(ReportNote::class)
            ->withPivot(ReportNote::class)
            ->withTimestamps();
    }
}
