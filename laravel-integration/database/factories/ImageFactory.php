<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Image::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'URI' => $faker->word,
        'file_type' => $faker->word,
    ];
});
