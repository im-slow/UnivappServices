<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Classroom::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'floor' => $faker->boolean,
        'directions' => $faker->text,
        'capacity' => $faker->randomNumber(),
        'columns' => $faker->randomNumber(),
        'rows' => $faker->randomNumber(),
        'accessibility' => $faker->boolean,
        'building_id' => factory(App\Building::class),
    ];
});
