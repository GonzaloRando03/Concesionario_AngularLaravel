<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MarcasController;
use App\Http\Controllers\CochesController;
use App\Http\Controllers\ClienteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post("marcas", "MarcasController@store");
Route::get("marcas", "MarcasController@index");
Route::get("marcas/{id}", "MarcasController@show");

Route::post("coches", "CochesController@store");
Route::get("coches", "CochesController@index");
Route::get("coches/{id}", "CochesController@show");

Route::post("usuario", "ClienteController@store");
Route::get("usuario", "ClienteController@index");
Route::get("usuario/{id}", "ClienteController@show");