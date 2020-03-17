<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Teacher::class, function (Faker $faker) {
    return [
        'office_address' => $faker->word,
        'phone' => $faker->phoneNumber,
        'office_hours' => $faker->word,
        'user_id' => factory(App\User::class),
        'office_id' => factory(App\Office::class),
    ];
});
