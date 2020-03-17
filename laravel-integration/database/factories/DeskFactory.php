<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Desk::class, function (Faker $faker) {
    return [
        'code' => $faker->randomNumber(),
        'orientation' => $faker->boolean,
        'position_x' => $faker->word,
        'position_y' => $faker->word,
        'classroom_id' => factory(App\Classroom::class),
        'desktype_id' => factory(App\DeskType::class),
    ];
});
