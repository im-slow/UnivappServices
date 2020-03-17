<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Upvote::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'note_id' => factory(App\Note::class),
        'user_id' => factory(App\User::class),
    ];
});
