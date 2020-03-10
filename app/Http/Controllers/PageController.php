<?php

namespace App\Http\Controllers;

use App\Http\Resources\PageCollection;
use App\Http\Resources\PageResource;
use App\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new PageCollection(Page::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $page = $request->isMethod('put') ? Page::findOrFail($request->id) : new Page();
        $data = $request->all();
        $page->fill($data);

        if($page->save()){
            return new PageResource($page);
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
        $page = Page::findOrfail($id);
        return new PageResource($page);
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
        $page = Page::findOrfail($id);
        $data = $request->all();
        $page->fill($data);

        if($page->save()){
            return new PageResource($page);
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
        $page = Page::findOrFail($id);
        if($page->delete()){
            return new PageResource($page);
        }
    }
}
