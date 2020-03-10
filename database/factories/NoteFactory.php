<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use Faker\Generator as Faker;

$factory->define(App\Note::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'file_type' => $faker->word,
        'description' => $faker->text,
        'lang' => $faker->word,
        'URI' => $faker->word,
        'token_price' => $faker->randomNumber(),
        'page_id' => factory(App\Page::class),
    ];
});
