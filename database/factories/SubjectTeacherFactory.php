<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\SubjectTeacher::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'subject_id' => factory(App\Subject::class),
        'teacher_id' => factory(App\Teacher::class),
    ];
});
