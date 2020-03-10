<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\ReportUser::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'title' => $faker->word,
        'description' => $faker->text,
        'reported_user_id' => factory(App\User::class),
        'user_id' => factory(App\User::class),
    ];
});
