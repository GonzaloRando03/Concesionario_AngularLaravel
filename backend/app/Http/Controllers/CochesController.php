<?php

namespace App\Http\Controllers;

use App\Coches;
use Illuminate\Http\Request;

class CochesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $coches = Coches::all();
            return $coches;

        } catch (Exception $e) {
            return abort(500, $e);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    
    public function store(Request $request)
    {
        try{
            $newCoche = new Coches;
            $newCoche->matricula = $request->matricula;
            $newCoche->modelo = $request->modelo;
            $newCoche->precio = $request->precio;
            $newCoche->marca_id = $request->marca_id;
            $newCoche->save();

            return $newCoche;

        } catch (Exception $e) {
            return abort(500, $e);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Coches  $coches
     * @return \Illuminate\Http\Response
     */
    public function show(Coches $coches)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Coches  $coches
     * @return \Illuminate\Http\Response
     */
    public function edit(Coches $coches)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Coches  $coches
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Coches $coches)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Coches  $coches
     * @return \Illuminate\Http\Response
     */
    public function destroy(Coches $coches)
    {
        //
    }
}
