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
        Route::get('logout', 'UserController@logout');
        Route::get('updateRole', 'UserController@updateRole');
        Route::get('remove', 'UserController@remove');
        Route::get('social-links', 'UserController@getSocialLinks');
        Route::get('purchased-note', 'UserController@getPurchasedNote');

    });

    // per testing non è necessaria l'autorizzazione
    // le route con # sono state implementate
    Route::resource('universities', 'UniversityController'); #
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


    Route::resource('departments', 'DepartmentController'); #
    Route::get('departments/{id}/teachers', 'DepartmentController@teachersByDepartment');
    Route::get('departments/{id}/students', 'DepartmentController@studentsByDepartment');

    Route::resource('faculties', 'FacultyController'); #
    Route::get('faculties/{id}/teachers', 'FacultyController@teachersByFaculty');
    Route::get('faculties/{id}/students', 'FacultyController@studentsByFaculty');

    Route::resource('buildings', 'BuildingController'); #
    Route::resource('buildings.classrooms', 'ClassroomsController'); //TODO
    Route::resource('buildings.office', 'OfficeController'); //TODO

    Route::resource('lessons', 'LessonController'); #
    Route::get('lessons/{name}', 'LessonController@searchByName');
    Route::get('lessons/{week-day}', 'LessonController@lessonsByWeekDay');

    Route::resource('subject', 'SubjectController'); #
    Route::get('subjects/{name}','SubjectController@searchByName');
    Route::get('subjects/{id}/teachers','SubjectController@teachersBySubject');

    Route::resource('teachers', 'TeacherController'); #

    Route::resource('students', 'StudentController'); #

    Route::resource('message', 'MessageController'); #
    Route::get('messages/{text}','MessageController@searchByName');
    Route::get('messages/{important}/users/{id}','MessageController@filterByImportant');
    Route::get('messages/{date-sent}/users/{id}','MessageController@filterByDate');

    Route::resource('rooms', 'RoomController'); #
    Route::get('rooms/{id}/users', 'RoomController@getUsers');

    Route::resource('markers', 'MarkerController'); #
    Route::resource('markers.images', 'ImageMarkerController');

    Route::resource('pages', 'PageController'); #
    Route::get('pages/{title}', 'PageController@searchByTitle');
    Route::get('pages/{user}', 'PageController@searchByUser');

    Route::resource('pages.notes', 'NoteController'); #
    Route::get('pages/{id}/notes/{title}', 'NoteController@searchByTitle');
    Route::get('pages/{id}/notes/{file-type}', 'NoteController@filterByFileType');
    Route::get('pages/{id}/notes/{lang}', 'NoteController@filterByLang');

    Route::resource('social-link', 'SocialLinkController'); #

});


