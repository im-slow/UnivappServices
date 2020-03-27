<?php

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

use App\Helper\Helper;

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

Route::prefix('v1/univaq')->group(function () {

    Route::post('login', 'UserController@login');
    Route::post('register', 'UserController@register');

    Route::group(['middleware' => 'auth.jwt'], function () {

        Route::get('logout', 'UserController@logout');
        Route::get('updateRole', 'UserController@updateRole');
        Route::get('remove', 'UserController@remove');

        Route::get('social-links', 'UserController@getSocialLinks');
        Route::get('purchased-note', 'UserController@getPurchasedNote');

        Route::resource('universities', 'UniversityController', ['only' => ['store', 'update', 'destroy']]);
        Route::resource('departments', 'DepartmentController', ['only' => ['store', 'update', 'destroy']]); #
        Route::resource('faculties', 'FacultyController', ['only' => ['store', 'update', 'destroy']]); #
        Route::resource('buildings', 'BuildingController', ['only' => ['store', 'update', 'destroy']]); #
        Route::resource('buildings.classrooms', 'ClassroomsController', ['only' => ['store', 'update', 'destroy']]); //TODO
        Route::resource('buildings.office', 'OfficeController', ['only' => ['store', 'update', 'destroy']]); //TODO
        Route::resource('teachers', 'TeacherController', ['only' => ['store', 'update', 'destroy']]);
        Route::resource('students', 'StudentController', ['only' => ['store', 'update', 'destroy']]);
        Route::resource('social-link', 'SocialLinkController', ['only' => ['store', 'update', 'destroy']]); #

    }); // fine autenticazione
        /*
        |--------------------------------------------------------------------------
        | Domain Services API
        |--------------------------------------------------------------------------
        */

    //Route::middleware(CheckService::class)

    Route::resource('universities', 'UniversityController', ['only' => ['index', 'show']]); #
    Route::resource('departments', 'DepartmentController', ['only' => ['index', 'show']]); #
    Route::resource('faculties', 'FacultyController', ['only' => ['index', 'show']]); #
    Route::resource('buildings', 'BuildingController', ['only' => ['index', 'show']]); #
    Route::resource('buildings.classrooms', 'ClassroomsController', ['only' => ['index', 'show']]); //TODO
    Route::resource('buildings.office', 'OfficeController', ['only' => ['index', 'show']]); //TODO
    Route::resource('teachers', 'TeacherController', ['only' => ['index', 'show']]);
    Route::resource('students', 'StudentController', ['only' => ['index', 'show']]);
    Route::resource('social-link', 'SocialLinkController', ['only' => ['index', 'show']]); #

    Route::get('universities/{name}', 'UniversityController@searchByName');
    Route::get('universities/{city}', 'UniversityController@searchByCity');
    Route::get('universities/{city}', 'UniversityController@searchByDistrict');
    Route::get('universities/{city}', 'UniversityController@searchByCountry');
    Route::get('universities/{id}/departments', 'UniversityController@departmentsByUniversity'); #
    Route::get('universities/{university-id}/departments{department-id}/faculties', 'UniversityController@facultiesByUniversity');
    Route::get('universities/{id}/teachers', 'UniversityController@teachersByUniversitiy');
    Route::get('universities/{id}/students', 'UniversityController@studentsByUniversitiy');
    Route::get('universities/{id}/rooms', 'UniversityController@roomsByUniversitiy'); //room messaggi
    Route::get('universities/{university-id}/rooms/{id}', 'UniversityController@roomByUniversitiy');

    Route::get('departments/{id}/teachers', 'DepartmentController@teachersByDepartment');
    Route::get('departments/{id}/students', 'DepartmentController@studentsByDepartment');

    Route::get('faculties/{id}/teachers', 'FacultyController@teachersByFaculty');
    Route::get('faculties/{id}/students', 'FacultyController@studentsByFaculty');

    /*
    |--------------------------------------------------------------------------
    | Services API
    |--------------------------------------------------------------------------
    */

    Route::group(['middleware' => 'auth.jwt'], function () {

        Route::resource('markers', 'MarkerController', ['only' => ['store', 'update', 'destroy']]); # marker della mappa
        Route::resource('markers.images', 'ImageMarkerController', ['only' => ['store', 'update', 'destroy']]);
        Route::resource('pages', 'PageController', ['only' => ['store', 'update', 'destroy']]); # pagine
        Route::resource('pages.notes', 'NoteController', ['only' => ['store', 'update', 'destroy']]); # appunti delle pagine
        Route::resource('lessons', 'LessonController', ['only' => ['store', 'update', 'destroy']]); # lezioni
        Route::resource('subject', 'SubjectController', ['only' => ['store', 'update', 'destroy']]); # materie
        Route::resource('rooms', 'RoomController', ['only' => ['store', 'update', 'destroy']]); # stanze
        Route::resource('message', 'MessageController', ['only' => ['store', 'update', 'destroy']]); # messaggi

    });

    Route::resource('markers', 'MarkerController', ['only' => ['index', 'show']]); # marker della mappa
    Route::resource('markers.images', 'ImageMarkerController', ['only' => ['index', 'show']]);
    Route::resource('pages', 'PageController', ['only' => ['index', 'show']]); # pagine
    Route::resource('pages.notes', 'NoteController', ['only' => ['index', 'show']]); # appunti delle pagine
    Route::resource('lessons', 'LessonController', ['only' => ['index', 'show']]); # lezioni
    Route::resource('subject', 'SubjectController', ['only' => ['index', 'show']]); # materie
    Route::resource('rooms', 'RoomController', ['only' => ['index', 'show']]); # stanze
    Route::resource('message', 'MessageController', ['only' => ['index', 'show']]); # messaggi

    Route::get('pages/{title}', 'PageController@searchByTitle');
    Route::get('pages/{user}', 'PageController@searchByUser');

    Route::get('pages/{id}/notes/{title}', 'NoteController@searchByTitle');
    Route::get('pages/{id}/notes/{file-type}', 'NoteController@filterByFileType');
    Route::get('pages/{id}/notes/{lang}', 'NoteController@filterByLang');

    Route::get('lessons/{name}', 'LessonController@searchByName');
    Route::get('lessons/{week-day}', 'LessonController@lessonsByWeekDay');

    Route::get('subjects/{name}','SubjectController@searchByName');
    Route::get('subjects/{id}/teachers','SubjectController@teachersBySubject');

    Route::get('rooms/{id}/users', 'RoomController@getUsers');

    Route::get('messages/{text}','MessageController@searchByName');
    Route::get('messages/{important}/users/{id}','MessageController@filterByImportant');
    Route::get('messages/{date-sent}/users/{id}','MessageController@filterByDate');

    /*
    |--------------------------------------------------------------------------
    | External Services API
    |--------------------------------------------------------------------------
    |
    | Servizio esterno - Gestionale offerte di lavoro
    |
    */

    // GET User
    Route::get('/users/{id}', function($id){
        return redirect((Config::get('constants.domain.job')).'/users/'.$id);
    });

    // GET Users
    Route::get('/users', function(){
        return redirect((Config::get('constants.domain.job')).'/users');
    });

    // GET Jobs
    Route::get('/jobs', function(){
        return redirect((Config::get('constants.domain.job')).'/jobs');
    });

    // GET Jobs
    Route::get('/jobs/{id}', function($id){
        return redirect((Config::get('constants.domain.job')).'/jobs/'.$id);
    });

    // GET Skills
    Route::get('/skills', function(){
        return redirect((Config::get('constants.domain.job')).'/skills');
    });

    // GET Skill
    Route::get('/skills/{id}', function($id){
        return redirect((Config::get('constants.domain.job')).'/skills/'.$id);
    });

    // GET Domains
    Route::get('/domains', function(){
        return redirect((Config::get('constants.domain.job')).'/domains');
    });

    // GET Domain
    Route::get('/domains/{id}', function($id){
        return redirect((Config::get('constants.domain.job')).'/domains/'.$id);
    });

    Route::group(['middleware' => 'auth.jwt'], function () {

        // POST User
        Route::post('/users', function (Request $request){
            $obj = (object) $request->post();
            return Helper::PostApi((Config::get('constants.domain.job').'/users'), $obj, 'application/x-www-form-urlencoded');
        });

        // PATCH User
        Route::post('/users/{id}', function($id, Request $request){
            $obj = (object) $request->post();
            return Helper::PatchApi((Config::get('constants.domain.job').'/users/'.$id), $obj, 'application/x-www-form-urlencoded');
        });

        // DELETE User
        Route::delete('/users/{id}', function($id){
            return Helper::DeleteApi((Config::get('constants.domain.job').'/users/'.$id));
        });

        // POST Jobs
        Route::post('/jobs', function (Request $request){
            $obj = (object) $request->post();
            return Helper::PostApi((Config::get('constants.domain.job').'/jobs'), $obj, 'application/x-www-form-urlencoded');
        });

        // PATCH Jobs
        Route::post('/jobs/{id}', function($id, Request $request){
            $obj = (object) $request->post();
            return Helper::PatchApi((Config::get('constants.domain.job').'/jobs/'.$id), $obj, 'application/x-www-form-urlencoded');
        });

        // DELETE Jobs
        Route::delete('/jobs/{id}', function($id){
            return Helper::DeleteApi((Config::get('constants.domain.job').'/jobs/'.$id));
        });

        // POST Skills
        Route::post('/skills', function (Request $request){
            $obj = (object) $request->post();
            return Helper::PostApi((Config::get('constants.domain.job').'/skills'), $obj, 'application/x-www-form-urlencoded');
        });

        // PATCH Skills
        Route::post('/skills/{id}', function($id, Request $request){
            $obj = (object) $request->post();
            return Helper::PatchApi((Config::get('constants.domain.job').'/skills/'.$id), $obj, 'application/x-www-form-urlencoded');
        });

        // DELETE Skills
        Route::delete('/skills/{id}', function($id){
            return Helper::DeleteApi((Config::get('constants.domain.job').'/skills/'.$id));
        });

        // POST Domains
        Route::post('/domains', function (Request $request){
            $obj = (object) $request->post();
            return Helper::PostApi((Config::get('constants.domain.job').'/domains'), $obj, 'application/x-www-form-urlencoded');
        });

        // PATCH Domains
        Route::post('/domains/{id}', function($id, Request $request){
            $obj = (object) $request->post();
            return Helper::PatchApi((Config::get('constants.domain.job').'/domains/'.$id), $obj, 'application/x-www-form-urlencoded');
        });

        // DELETE Domains
        Route::delete('/domains/{id}', function($id){
            return Helper::DeleteApi((Config::get('constants.domain.job').'/domains/'.$id));
        });

    });
});


