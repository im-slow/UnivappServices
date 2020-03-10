<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\University::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'country' => $faker->country,
        'district' => $faker->word,
        'city' => $faker->city,
    ];
});
