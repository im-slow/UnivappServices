<?php

use Illuminate\Database\Seeder;
use App\Service;

class ServiceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            ['all', 'tutti i permessi'],
        ];

        foreach ($permissions as $permission) {
            Service::create(['name' => $permission[0], 'description' => $permission[1]]);
        }
    }
}
