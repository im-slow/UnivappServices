<?php

namespace App\Http\Controllers;

use App\Department;
use App\Http\Resources\DepartmentCollection;
use App\University;
use App\Http\Resources\UniversityResource;
use App\Http\Resources\UniversityCollection;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new UniversityCollection(University::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $university = $request->isMethod('put') ? University::findOrFail($request->id) : new University();
        $data = $request->all();
        $university->fill($data);

        if($university->save()){
            return new UniversityResource($university);
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
        $university = University::findOrfail($id);
        return new UniversityResource($university);
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
        $university = University::findOrfail($id);
        $data = $request->all();
        $university->fill($data);

        if($university->save()){
            return new UniversityResource($university);
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
        $university = University::findOrFail($id);
        if($university->delete()){
            return new UniversityResource($university);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function departmentsByUniversity($id)
    {
        $department = Department::where('university_id', $id)->get();
        return new DepartmentCollection($department);
    }
}
