<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoomCollection;
use App\Http\Resources\RoomResource;
use App\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new RoomCollection(Room::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $room = $request->isMethod('put') ? Room::findOrFail($request->id) : new Room();
        $data = $request->all();
        $room->fill($data);

        if($room->save()){
            return new RoomResource($room);
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
        $room = Room::findOrfail($id);
        return new RoomResource($room);
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
        $room = Room::findOrfail($id);
        $data = $request->all();
        $room->fill($data);

        if($room->save()){
            return new RoomResource($room);
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
        $room = Room::findOrFail($id);
        if($room->delete()){
            return new RoomResource($room);
        }
    }
}
