<?php

namespace App\Http\Controllers;

use App\Coches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            $coches = DB::table('coches')
                ->select('coches.*', 'marcas.nombre as marca')
                ->leftJoin('marcas', 'coches.marca_id', '=', 'marcas.id')
                ->get();

            $response = array();

            foreach($coches as $c){
                $search = array(" ", "é");
                $replace = array("_","e");
                $modelReplace = str_replace($search, $replace, $c->modelo);
                $image = public_path()."/img/$modelReplace.jpg";
                $coche = array(
                    "matricula"=> $c->matricula
                        ? $c->matricula
                        : "No matriculado",
                    "marca_id"=> $c->marca_id,
                    "marca"=> $c->marca,
                    "precio"=>$c->precio,
                    "id"=> $c->id,
                    "modelo"=>$c->modelo,
                    "image"=> file_exists($image) 
                        ? "http://localhost:8000/img/$modelReplace.jpg"
                        : "http://localhost:8000/img/default.png"            
                );
                array_push($response, $coche);
            }
            return $response;

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
        if (strlen($request->token) <= 10){
            return abort(400, 'No estás autorizado a realizar esta acción');
        }

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

    public function edit(Request $request, Coches $coches)
    {
        if (strlen($request->token) <= 10){
            return abort(400, 'No estás autorizado a realizar esta acción');
        }

        try {
            $coche = Coches::where('id', $request->id)->firstOrFail();
            $coche->matricula = $request->matricula;
            $coche->modelo = $request->modelo;
            $coche->precio = $request->precio;
            $coche->marca_id = $request->marca_id;
            $coche->save();
            return $coche;

        }catch(Exeption $e){
            return abort(500, $e);
        }
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

    public function destroy(Request $request, Coches $coche)
    {   
        try{
            $coche->delete();
            return array("msg"=>"Borrado correctamente");
        
        }catch(Exeption $e){
            return abort(500, $e);
        }
    }
}
