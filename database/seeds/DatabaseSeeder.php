<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('universities')->insert([
            ['name' => 'Università degli studi dell\'Aquila', 'country' => 'Abruzzo', 'district' => 'AQ', 'city' => 'l\'Aquila'],
            ['name' => 'Università degli studi di Teramo', 'country' => 'Abruzzo', 'district' => 'TE', 'city' => 'Teramo'],
            ['name' => 'Politecnico di Milano', 'country' => 'Lombardia', 'district' => 'MI', 'city' => 'Milano'],
            ['name' => 'Politecnico di Torino', 'country' => 'Piemonte', 'district' => 'TO', 'city' => 'Torino'],
        ]);
        factory(App\Marker::class, 50)->create()->each(function ($marker) {
            $marker->building()->save(factory(App\Building::class)->make());
            //$marker->classroom()->save(factory(App\Classroom::class)->make());
            //$marker->office()->save(factory(App\Office::class)->make());
        });

        $this->call(RoleTableSeeder::class);
        $this->call(ServiceTableSeeder::class);

        factory(App\University::class, 50)->create()->each(function ($university) {
            $userS = $university->user()->save(factory(App\User::class)->make());
            $userT = $university->user()->save(factory(App\User::class)->make());
            $student = $userS->student()->save(factory(App\Student::class)->make());
            $teacher = $userT->teacher()->save(factory(App\Teacher::class)->make());
        });

//        factory(App\User::class, 50)->create()->each(function ($user) {
//            $user->student()->save(factory(App\Student::class)->make());
//            //$user->teacher()->save(factory(App\Teacher::class)->make());
//
//            $user->sociallink()->save(factory(App\SocialLink::class)->make());
//            $user->page()->save(factory(App\Page::class)->make());
//            $user->purchasednote()->save(factory(App\PurchasedNote::class)->make());
//            $user->token()->save(factory(App\Token::class)->make());
//            $user->upvote()->save(factory(App\Upvote::class)->make());
//            $user->downvote()->save(factory(App\Downvote::class)->make());
//            //$user->reportnote()->save(factory(App\ReportNote::class)->make());
//            $user->desk()->save(factory(App\Desk::class)->make());
//            $user->classroom()->save(factory(App\Classroom::class)->make());
//            $user->room()->save(factory(App\Room::class)->make());
//        });
        $this->call(RoleTableSeeder::class);
        $this->call(ServiceTableSeeder::class);
        //$this->call(UserTableSeeder::class);


    }
}
