<?php

namespace App\Http\Controllers;

use App\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    
    public function index()
    {
        try{
            $clientes = Cliente::all();
            $response = array();

            foreach($clientes as $c){
                $gps = DB::select('SELECT ST_AsText(gps) as location from clientes WHERE id = ?', [$c->id]);
                $cliente = array(
                    "id"=>$c->id,
                    "nombre"=>$c->nombre,
                    "email"=>$c->email,
                    "gps"=>$gps[0]->location,
                    "password"=>$c->password,
                );
                array_push($response, $cliente);
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
        try{
            $tryEmail = DB::table('clientes')->select('email')->where('email', '=', $request->email)->first();
            if ($tryEmail){
                return abort(422, "El email está en uso");
            }

            $passwordCrypt = crypt($request->password, '$2a$07$usesomesillystringforsalt$');

            $newCliente = new Cliente;
            $newCliente->nombre = $request->nombre;
            $newCliente->email = $request->email;
            $newCliente->gps = DB::raw($request->gps);
            $newCliente->password = $passwordCrypt;
            $newCliente->save();

            $response = array(
                "id"=>$newCliente->id,
                "nombre"=>$newCliente->nombre,
                "email"=>$newCliente->email,
                "gps"=>strval($request->gps),
                "password"=>$newCliente->password,
            );

            return $response;

        } catch (Exception $e) {
            return abort(500, $e);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Cliente  $cliente
     * @return \Illuminate\Http\Response
     */
    public function show(Cliente $cliente)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Cliente  $cliente
     * @return \Illuminate\Http\Response
     */
    public function edit(Cliente $cliente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Cliente  $cliente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Cliente $cliente)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Cliente  $cliente
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cliente $cliente)
    {
        //
    }
}
