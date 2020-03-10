<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\RoomUser::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'archived' => $faker->boolean,
        'user_id' => factory(App\User::class),
        'room_id' => factory(App\Room::class),
    ];
});
