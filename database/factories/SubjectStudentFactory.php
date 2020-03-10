<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\SubjectStudent::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'subject_id' => factory(App\Subject::class),
        'student_id' => factory(App\Student::class),
    ];
});
