<?php

namespace App\Http\Controllers;

use App\Building;
use App\Http\Resources\BuildingCollection;
use App\Http\Resources\BuildingResource;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new BuildingCollection(Building::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $building = $request->isMethod('put') ? Building::findOrFail($request->id) : new Building();
        $data = $request->all();
        $building->fill($data);

        if($building->save()){
            return new BuildingResource($building);
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
        $building = Building::findOrfail($id);
        return new BuildingResource($building);
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
        $building = Building::findOrfail($id);
        $data = $request->all();
        $building->fill($data);

        if($building->save()){
            return new BuildingResource($building);
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
        $building = Building::findOrFail($id);
        if($building->delete()){
            return new BuildingResource($building);
        }
    }
}
