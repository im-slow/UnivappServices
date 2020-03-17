<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Room::class, function (Faker $faker) {
    return [
        'type' => $faker->randomNumber(),
        'name' => $faker->name,
        'description' => $faker->text,
        'university_id' => factory(App\University::class),
        'room_type_id' => factory(App\RoomType::class),
    ];
});
