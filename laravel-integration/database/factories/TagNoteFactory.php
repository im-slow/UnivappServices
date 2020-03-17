<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\TagNote::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'note_id' => factory(App\Note::class),
        'tag_id' => factory(App\Tag::class),
    ];
});
