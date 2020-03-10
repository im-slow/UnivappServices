<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\PurchasedNote::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'user_id' => factory(App\User::class),
        'note_id' => factory(App\Note::class),
    ];
});
