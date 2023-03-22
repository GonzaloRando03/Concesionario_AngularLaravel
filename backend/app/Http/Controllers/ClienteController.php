<?php
namespace App\Http\Controllers;

use Firebase\JWT\JWT;
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
                    "created_at"=>substr($c->created_at, 0, -9)
                );
                array_push($response, $cliente);
            }
            return response($response)->cookie('cookie1', 'valor1', 2);

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
            $newCliente->password = $passwordCrypt;
            if($request->gps){
                $newCliente->gps = DB::raw($request->gps);
            }
            $newCliente->save();
            $time = time();

            //creación del token
            $token = array(
                "iat"=> $time,
                "exp"=> $time + (60*60*24),
                "data"=> [
                    "id"=> $newCliente->id,
                    "nombre"=> $newCliente->nombre,
                    "email"=> $newCliente->email
                ]
            );
            $jwt = JWT::encode($token, "gonzalocars",'HS256');
            
            $gps = DB::select('SELECT ST_AsText(gps) as location from clientes WHERE id = ?', [$newCliente->id]);

            $response = array(
                "id"=>$newCliente->id,
                "nombre"=>$newCliente->nombre,
                "email"=>$newCliente->email,
                "gps"=>$gps[0]->location,
                "password"=>$newCliente->password,
                "token"=> $jwt
            );

            return response($response)->cookie('token', $jwt, 5);

        } catch (Exception $e) {
            return abort(500, $e);
        }
    }

    
    public function show(Cliente $cliente)
    {
        $compras = DB::table('compras')
                ->select(array('coches.matricula', 'marcas.nombre', 'coches.modelo', 'coches.precio', 'compras.created_at'))
                ->leftJoin('coches', 'compras.matricula_coche', '=', 'coches.matricula')
                ->leftJoin('clientes', 'compras.usuario_id', '=', 'clientes.id')
                ->leftJoin('marcas', 'coches.marca_id', '=', 'marcas.id')
                ->where('clientes.id','=',"$cliente->id")
                ->get();

        return $compras;
    }

    
    public function login(Request $request)
    {
        try{
            $user = DB::table('clientes')->where('email', '=', $request->email)->first();
            $passwordCrypt = crypt($request->password, '$2a$07$usesomesillystringforsalt$');

            if($user->password !== $passwordCrypt){
                return abort(401, 'Contraseña incorrecta');
            }

            $time = time();

            //creación del token
            $token = array(
                "iat"=> $time,
                "exp"=> $time + (60*60*24),
                "data"=> [
                    "id"=> $user->id,
                    "nombre"=> $user->nombre,
                    "email"=> $user->email
                ]
            );
            $jwt = JWT::encode($token, "gonzalocars",'HS256');

            $gps = DB::select('SELECT ST_AsText(gps) as location from clientes WHERE id = ?', [$user->id]);

            $response = array(
                "id"=>$user->id,
                "nombre"=>$user->nombre,
                "email"=>$user->email,
                "password"=>$user->password,
                "token"=> $jwt,
                "gps"=>$gps[0]->location,
            );

            return response($response)->cookie('token', $jwt, 5);

        }catch(Exception $e){
            return abort(500, $e);
        }
    }

    public function edit(Request $request, Cliente $cliente)
    {

        try {
            $cliente = Cliente::where('id', $request->id)->firstOrFail();
            $cliente->nombre = $request->nombre;
            $cliente->email = $request->email;
            if($request->password){
                $cliente->password = $passwordCrypt = crypt($request->password, '$2a$07$usesomesillystringforsalt$');
            }
            $cliente->save();
            return $cliente;

        }catch(Exeption $e){
            return abort(500, $e);
        }
    }

    public function destroy(Request $request, Cliente $cliente)
    {   
        try{
            $cliente->delete();
            return array("msg"=>"Borrado correctamente");
        
        }catch(Exeption $e){
            return abort(500, $e);
        }
    }
}
