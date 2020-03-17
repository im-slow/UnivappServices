<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\SubjectFaculty::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'subject_id' => factory(App\Subject::class),
        'faculty_id' => factory(App\Faculty::class),
    ];
});
