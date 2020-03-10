<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\DeskUser::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'date' => $faker->date(),
        'start_time' => $faker->time(),
        'end_time' => $faker->time(),
        'check' => $faker->boolean,
        'seat' => $faker->randomNumber(),
        'break_start_time' => $faker->time(),
        'user_id' => factory(App\User::class),
        'desk_id' => factory(App\Desk::class),
    ];
});
