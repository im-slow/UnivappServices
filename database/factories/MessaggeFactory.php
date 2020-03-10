<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Messagge::class, function (Faker $faker) {
    return [
        'text' => $faker->word,
        'important' => $faker->boolean,
        'seen' => $faker->boolean,
        'user_id' => factory(App\User::class),
        'room_id' => factory(App\Room::class),
    ];
});
