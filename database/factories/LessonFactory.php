<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Lesson::class, function (Faker $faker) {
    return [
        'start_time' => $faker->boolean,
        'duration' => $faker->boolean,
        'week_day' => $faker->boolean,
        'classroom_id' => factory(App\Classroom::class),
        'start_date' => $faker->date(),
        'end_date' => $faker->date(),
        'required_presence' => $faker->boolean,
        'teacher_id' => factory(App\Teacher::class),
    ];
});
