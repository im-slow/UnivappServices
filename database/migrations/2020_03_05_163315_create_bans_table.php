<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('description'); // matricola
            $table->string('duration'); // matricola
            $table->string('type'); // matricola
            $table->unsignedBigInteger('banned_user_id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('banned_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
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
        Schema::dropIfExists('bans');
    }
}
