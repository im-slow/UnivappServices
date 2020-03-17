<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\ImageMarker::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'image_id' => factory(App\Imagine::class),
        'marker_id' => factory(App\Marker::class),
    ];
});
