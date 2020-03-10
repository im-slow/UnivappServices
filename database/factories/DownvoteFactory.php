<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Downvote::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'note_id' => $faker->factory(App\Note::class),
        'user_id' => $faker->factory(App\User::class),
    ];
});
