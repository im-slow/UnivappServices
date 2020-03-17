<?php

namespace App\Http\Controllers;

use App\Department;
use App\Http\Resources\DepartmentCollection;
use App\Http\Resources\DepartmentResource;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $department = Department::all();
        return new DepartmentCollection($department);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $department = $request->isMethod('put') ? Department::findOrFail($request->id) : new Department();
        $data = $request->all();
        $department->fill($data);

        if($department->save()){
            return new DepartmentResource($department);
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
        $department = Department::findOrfail($id);
        return new DepartmentResource($department);
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
        $department = Department::findOrfail($id);
        $data = $request->all();
        $department->fill($data);

        if($department->save()){
            return new DepartmentResource($department);
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
        $department = Department::findOrfail($id);
        if($department->delete()){
            return new DepartmentResource($department);
        }
    }
}
