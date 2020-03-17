<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Building::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'address' => $faker->word,
        'marker_id' => factory(App\Marker::class),
    ];
});
