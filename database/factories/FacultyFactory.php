<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Faculty::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->text,
        'code' => $faker->word,
        'type' => $faker->word,
        'department_id' => factory(App\Department::class),
    ];
});
