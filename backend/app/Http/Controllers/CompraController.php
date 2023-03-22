<?php

namespace App\Http\Controllers;

use App\Compra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    public function index()
    {
        try{
            $compras = DB::table('compras')
                ->select(array('compras.*', 'coches.modelo', 'coches.precio', 'clientes.nombre'))
                ->leftJoin('coches', 'compras.matricula_coche', '=', 'coches.matricula')
                ->leftJoin('clientes', 'compras.usuario_id', '=', 'clientes.id')
                ->get();
            return $compras;

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
            $newCompra = new Compra;
            $newCompra->usuario_id = $request->usuario_id;
            $newCompra->matricula_coche = $request->matricula_coche;
            $newCompra->save();
            return response($newCompra);

        } catch (Exception $e) {
            return abort(500, $e);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Compra  $compra
     * @return \Illuminate\Http\Response
     */
    public function show(Compra $compra)
    {
        //
    }

  
    public function edit(Request $request, Compra $compra)
    {
        if (strlen($request->token) <= 10){
            return abort(400, 'No estás autorizado a realizar esta acción');
        }

        try {
            $compra = Compra::where('id', $request->id)->firstOrFail();
            $compra->usuario_id = $request->usuario_id;
            $compra->matricula_coche = $request->matricula_coche;
            $compra->save();
            return $compra;

        }catch(Exeption $e){
            return abort(500, $e);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Compra  $compra
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Compra $compra)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Compra  $compra
     * @return \Illuminate\Http\Response
     */
    public function destroy(Compra $compra)
    {
        try{
            $compra->delete();
            return array("msg"=>"Borrado correctamente");
        
        }catch(Exeption $e){
            return abort(500, $e);
        }
    }
}
