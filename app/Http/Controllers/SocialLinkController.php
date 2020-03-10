<?php

namespace App\Http\Controllers;

use App\Http\Resources\SocialLinkCollection;
use App\Http\Resources\SocialLinkResource;
use App\SocialLink;
use Illuminate\Http\Request;

class SocialLinkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new SocialLinkCollection(SocialLink::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $social_link = $request->isMethod('put') ? SocialLink::findOrFail($request->id) : new SocialLink();
        $data = $request->all();
        $social_link->fill($data);

        if($social_link->save()){
            return new SocialLinkResource($social_link);
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
        $social_link = SocialLink::findOrfail($id);
        return new SocialLinkResource($social_link);
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
        $social_link = SocialLink::findOrfail($id);
        $data = $request->all();
        $social_link->fill($data);

        if($social_link->save()){
            return new SocialLinkResource($social_link);
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
        $social_link = SocialLink::findOrFail($id);
        if($social_link->delete()){
            return new SocialLinkResource($social_link);
        }
    }
}
