<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessaggesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messagges', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('text');
            $table->boolean('important')->default(false);
            $table->boolean('seen')->default(false);
            $table->date("date_sent");
            $table->date("date_seen");
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('room_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->foreign('room_id')
                ->references('id')
                ->on('rooms')
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
        Schema::dropIfExists('messagges');
    }
}
