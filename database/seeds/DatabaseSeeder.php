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
        $this->call(RoleTableSeeder::class);
        $this->call(ServiceTableSeeder::class);
        $this->call(UserTableSeeder::class);

    }
}
