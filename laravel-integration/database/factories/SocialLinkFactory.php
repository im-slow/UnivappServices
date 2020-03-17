<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\SocialLink::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'value' => $faker->word,
        'user_id' => factory(App\User::class),
    ];
});
