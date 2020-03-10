<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Office::class, function (Faker $faker) {
    return [
        'floor' => $faker->text(5),
        'number' => $faker->text(5),
        'description' => $faker->text,
        'building_id' => factory(App\Building::class),
        'marker_id' => factory(App\Marker::class),
    ];
});
