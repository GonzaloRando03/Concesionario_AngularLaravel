<?php

namespace App\Http\Controllers;

use App\Marcas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarcasController extends Controller
{

    public function index(Request $request)
    {
        try{
            $marcas = DB::table('marcas')
                ->select(array('marcas.*', DB::raw('COUNT(coches.id) as coches_totales')))
                ->leftJoin('coches', 'marcas.id', '=', 'coches.marca_id')
                ->groupBy('marcas.id')
                ->get();

            $response = array();

            foreach($marcas as $m){
                $search = array(" ", "é");
                $replace = array("_","e");
                $marcaReplace = str_replace($search, $replace, $m->nombre);
                $image = public_path()."/img/$marcaReplace.png";

                $marca = array(
                    "id"=> $m->id,
                    "created_at"=> $m->created_at,
                    "updated_at"=> $m->updated_at,
                    "nombre"=> $m->nombre,
                    "pais"=> $m->pais,
                    "coches_totales"=> $m->coches_totales,
                    "image" => file_exists($image)
                        ? "http://localhost:8000/img/$marcaReplace.png"
                        : "http://localhost:8000/img/default.png"
                );
                array_push($response, $marca);
            }
            return $response;

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
        if (strlen($request->token) <= 10){
            return abort(400, 'No estás autorizado a realizar esta acción');
        }

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


    public function edit(Request $request, Marcas $marcas)
    {
        if (strlen($request->token) <= 10){
            return abort(400, 'No estás autorizado a realizar esta acción');
        }

        try {
            $marca = Marcas::where('id', $request->id)->firstOrFail();
            $marca->nombre = $request->nombre;
            $marca->pais = $request->pais;
            $marca->save();
            return $marca;

        }catch(Exeption $e){
            return abort(500, $e);
        }
    }


    public function update(Request $request, Marcas $marcas)
    {
        //
    }


    public function destroy(Request $request, Marcas $marca)
    {   
        try{
            $marca->delete();
            return array("msg"=>"Borrado correctamente");
        
        }catch(Exeption $e){
            return abort(500, $e);
        }
    }
}
