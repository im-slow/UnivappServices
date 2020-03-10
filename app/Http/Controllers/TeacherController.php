<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeacherCollection;
use App\Http\Resources\TeacherResource;
use App\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new TeacherCollection(Teacher::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $teacher = $request->isMethod('put') ? Teacher::findOrFail($request->id) : new Teacher();
        $data = $request->all();
        $teacher->fill($data);

        if($teacher->save()){
            return new TeacherResource($teacher);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $teacher = Teacher::findOrfail($id);
        return new TeacherResource($teacher);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrfail($id);
        $data = $request->all();
        $teacher->fill($data);

        if($teacher->save()){
            return new TeacherResource($teacher);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        if($teacher->delete()){
            return new TeacherResource($teacher);
        }
    }
}
