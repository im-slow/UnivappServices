<?php

namespace App\Http\Controllers;

use App\Http\Resources\MarkerCollection;
use App\Http\Resources\MarkerResource;
use App\Marker;
use Illuminate\Http\Request;

class MarkerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new MarkerCollection(Marker::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $marker = $request->isMethod('put') ? Marker::findOrFail($request->id) : new Marker();
        $data = $request->all();
        $marker->fill($data);

        if($marker->save()){
            return new MarkerResource($marker);
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
        $marker = Marker::findOrfail($id);
        return new MarkerResource($marker);
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
        $marker = Marker::findOrfail($id);
        $data = $request->all();
        $marker->fill($data);

        if($marker->save()){
            return new MarkerResource($marker);
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
        $marker = Marker::findOrFail($id);
        if($marker->delete()){
            return new MarkerResource($marker);
        }
    }
}
