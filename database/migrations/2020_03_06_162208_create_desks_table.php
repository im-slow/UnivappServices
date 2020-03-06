<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDesksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('desks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('code');
            $table->boolean('orientation'); // to check, orientamento banchi "verticale" o "orizzontale"
            $table->string('position_x');
            $table->string('position_y');
            $table->unsignedBigInteger('classroom_id');
            $table->unsignedBigInteger('desktype_id');
            $table->foreign('classroom_id')
                ->references('id')
                ->on('classrooms')
                ->onDelete('cascade');
            $table->foreign('desktype_id')
                ->references('id')
                ->on('desk_types')
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
        Schema::dropIfExists('desks');
    }
}
