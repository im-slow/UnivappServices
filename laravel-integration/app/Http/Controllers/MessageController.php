<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessaggeCollection;
use App\Http\Resources\MessaggeResource;
use App\Messagge;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new MessaggeCollection(Messagge::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $messagge = $request->isMethod('put') ? Messagge::findOrFail($request->id) : new Messagge();
        $data = $request->all();
        $messagge->fill($data);

        if($messagge->save()){
            return new MessaggeResource($messagge);
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
        $messagge = Messagge::findOrfail($id);
        return new MessaggeResource($messagge);
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
        $messagge = Messagge::findOrfail($id);
        $data = $request->all();
        $messagge->fill($data);

        if($messagge->save()){
            return new MessaggeResource($messagge);
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
        $messagge = Messagge::findOrFail($id);
        if($messagge->delete()){
            return new MessaggeResource($messagge);
        }
    }
}
