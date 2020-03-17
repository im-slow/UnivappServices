<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'surname' => $faker->word,
        'email' => $faker->safeEmail,
        'password' => bcrypt($faker->password),
        'university_id' => factory(App\University::class),
        'remember_token' => Str::random(10),
    ];
});
