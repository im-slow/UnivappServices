<?php

namespace App\Http\Controllers;

use App\Faculty;
use App\Http\Resources\FacultyCollection;
use App\Http\Resources\FacultyResource;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function indexUniversity($id)
    {
        //$department = Department::all()->where('university_id', $university_id)->get();
        //$faculty = Faculty::with(department.univeristy_id, $id)->get()
//        $faculty = Faculty::all();
//        $departments = Department::where('university_id', $id)->get();
//        $data = [];
//        $i=0;

        //return $data;

        //$faculty = $faculty->has($department);
        //$faculty = $faculty->departments()->where('department_id', $department->id)->universities()->where('universities_id', $id)->get();

        //return new FacultyCollection($faculty);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $faculty = Faculty::all();
        return new FacultyCollection($faculty);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $faculty = $request->isMethod('put') ? Faculty::findOrFail($request->id) : new Faculty();

        $data = $request->all();
        $faculty->fill($data);

        if($faculty->save()){
            return new FacultyResource($faculty);
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
        $faculty = Faculty::findOrfail($id);
        return new FacultyResource($faculty);
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
        $faculty = Faculty::findOrfail($id);
        $data = $request->all();
        $faculty->fill($data);

        if($faculty->save()){
            return new FacultyResource($faculty);
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
        $faculty = Department::findOrfail($id);
        if($faculty->delete()){
            return new FacultyResource($faculty);
        }
    }
}
