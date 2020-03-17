<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Page::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->text,
        'user_id' => factory(App\User::class),
        'subject_id' => factory(App\Subject::class),
    ];
});
