<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('type'); // tipo di stanza
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->unsignedBigInteger('university_id');
            $table->unsignedBigInteger('room_type_id');
            $table->foreign('university_id')
                ->references('id')
                ->on('universities')
                ->onDelete('cascade');
            $table->foreign('room_type_id')
                ->references('id')
                ->on('room_types')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rooms');
    }
}
