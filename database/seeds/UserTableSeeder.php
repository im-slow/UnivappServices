<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $users = [
            [Str::random(10), Str::random(10), Str::random(10).'@gmail.com', Hash::make('password'), 1],
            [Str::random(10), Str::random(10), Str::random(10).'@gmail.com', Hash::make('password'), 2],
            [Str::random(10), Str::random(10), Str::random(10).'@gmail.com', Hash::make('password'), 3],
            [Str::random(10), Str::random(10), Str::random(10).'@gmail.com', Hash::make('password'), 4],
        ];

        foreach ($users as $user)
            User::create([
                'name' => $user[0],
                'surname' => $user[1],
                'email' => $user[2],
                'password' => $user[3],
                'user_role_id' => $user[4],
            ]);
        }
}
