<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\ReportNote::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'title' => $faker->word,
        'description' => $faker->text,
        'note_id' => factory(App\Note::class),
        'user_id' => factory(App\User::class),
    ];
});
