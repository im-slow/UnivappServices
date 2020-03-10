<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\SubjectLesson::class, function (Faker $faker) {
    return [
        'id' => $faker->randomNumber(),
        'subject_id' => factory(App\Subject::class),
        'lesson_id' => factory(App\Lesson::class),
    ];
});
