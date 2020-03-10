<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Student::class, function (Faker $faker) {
    return [
        'matric_no' => $faker->randomNumber(6),
        'course_year' => $faker->randomNumber(),
        'supplementary_year' => $faker->boolean(30),
        'faculty_id' => factory(App\Faculty::class),
        'user_id' => factory(App\User::class),
    ];
});
