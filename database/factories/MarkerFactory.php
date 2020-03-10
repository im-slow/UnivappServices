<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Marker::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'address' => $faker->word,
        'lat' => $faker->latitude,
        'lng' => $faker->longitude,
        'type' => $faker->word,
        'important' => $faker->boolean,
    ];
});
