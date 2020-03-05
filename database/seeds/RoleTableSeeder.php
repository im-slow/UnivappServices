<?php

use Illuminate\Database\Seeder;
use App\Role;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            ['ADMIN-ALL', 'tutti i permessi'],

            ['ADMIN-job', 'tutti i permessi, gestionale offerte di lavoro'],
            ['ADMIN-notes', 'tutti i permessi, sharing di appunti '],
            ['ADMIN-map', 'tutti i permessi, portami a destinazione'],
            ['ADMIN-msg', 'tutti i permessi, mettimi in contatto con...'],
            ['ADMIN-calendar', 'tutti i permessi, calendario personalizzato delle lezioni'],
            ['ADMIN-room', 'tutti i permessi, gestionale aule'],

            ['MODERATOR-job', 'servizi moderatore, gestionale offerte di lavoro'],
            ['MODERATOR-notes', 'servizi moderatore, sharing di appunti'],
            ['MODERATOR-map', 'servizi moderatore, portami a destinazione'],
            ['MODERATOR-msg', 'servizi moderatore, mettimi in contatto con...'],
            ['MODERATOR-calendar', 'servizi moderatore, calendario personalizzato delle lezioni'],
            ['MODERATOR-room', 'servizi moderatore, gestionale aule'],

            ['TEACHER-job', 'servizi docente, gestionale offerte di lavoro'],
            ['TEACHER-notes', 'servizi docente, sharing di appunti'],
            ['TEACHER-map', 'servizi docente, portami a destinazione'],
            ['TEACHER-msg', 'servizi docente, mettimi in contatto con...'],
            ['TEACHER-calendar', 'servizi docente, calendario personalizzato delle lezioni'],
            ['TEACHER-room', 'servizi docente, gestionale aule'],

            ['USER-job', 'servizi utente, gestionale offerte di lavoro'],
            ['USER-notes', 'servizi utente, sharing di appunti'],
            ['USER-map', 'servizi utente, portami a destinazione'],
            ['USER-msg', 'servizi utente, mettimi in contatto con...'],
            ['USER-calendar', 'servizi utente, calendario personalizzato delle lezioni'],
            ['USER-room', 'servizi utente, gestionale aule'],
        ];

        foreach ($roles as $role) {
            Role::create(['name' => $role[0], 'description' => $role[1]]);
        }
    }
}
