<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Subject::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'code' => $faker->word,
        'CFU' => $faker->boolean,
        'semester' => $faker->boolean,
        'language' => $faker->word,
    ];
});
