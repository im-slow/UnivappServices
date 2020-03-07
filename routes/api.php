<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// default commentate
//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::prefix('v1')->group(function () {

    Route::post('login', 'UserController@login');
    Route::post('register', 'UserController@register');

    Route::group(['middleware' => 'auth.jwt'], function () {
        Route::get('/logout', 'UserController@logout');
        Route::get('/updateRole', 'UserController@updateRole');
        Route::get('/remove', 'UserController@remove');

//        Route::get('tasks', 'TaskController@index');
//        Route::get('tasks/{id}', 'TaskController@show');
//        Route::post('tasks', 'TaskController@store');
//        Route::put('tasks/{id}', 'TaskController@update');
//        Route::delete('tasks/{id}', 'TaskController@destroy');
    });
});


