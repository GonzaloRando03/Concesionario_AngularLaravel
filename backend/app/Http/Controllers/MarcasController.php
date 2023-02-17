<?php

namespace App\Http\Controllers;

use App\Marcas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarcasController extends Controller
{

    public function index()
    {
        try{
            $marcas = Marcas::all();
            return $marcas;

        } catch (Exception $e) {
            return abort(500, $e);
        }
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        try{
            $newMarca = new Marcas;
            $newMarca->nombre = $request->nombre;
            $newMarca->pais = $request->pais;
            $newMarca->save();

            return $newMarca;

        } catch (Exception $e) {
            return abort(500, $e);
        }
    }


    public function show(Marcas $marcas)
    {
        //
    }


    public function edit(Marcas $marcas)
    {
        //
    }


    public function update(Request $request, Marcas $marcas)
    {
        //
    }


    public function destroy(Marcas $marcas)
    {
        //
    }
}
