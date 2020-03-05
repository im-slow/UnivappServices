<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('surname');
            $table->string('email')->unique();
            $table->string('password');
            //$table->unsignedBigInteger('role_id')->nullable()->default(4);
            $table->unsignedBigInteger('university_id');
            $table->foreign('university_id')
                ->references('id')
                ->on('universities')
                ->onDelete('cascade');
//            $table->unsignedBigInteger('faculty_id')->nullable();
//            $table->unsignedBigInteger('department_id')->nullable();
            $table->rememberToken();
            $table->timestamps();

            /*
            $table->string('matric_no', 7);
            $table->unsignedBigInteger('user_role_id')->nullable()->default(1);
            $table->unsignedBigInteger('degree_id')->nullable();
            $table->unsignedBigInteger('uni_degree_id')->nullable();
            */


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
