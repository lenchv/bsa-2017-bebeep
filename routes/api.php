<?php

use Illuminate\Http\Request;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'user', 'as' => 'user.'], function () {

    Route::post('register',
        ['middleware' => 'jwt.guest', 'as' => 'register', 'uses' => 'Auth\RegisterController@register']);
    Route::post('verify', ['middleware' => 'jwt.guest', 'as' => 'verify', 'uses' => 'Auth\RegisterController@verify']);
    Route::post('authorization', ['middleware' => 'jwt.guest', 'as' => 'authorization', 'uses' => 'Auth\LoginController@authorization']);
    Route::post('logout', ['as' => 'logout', 'uses' => 'Auth\LoginController@logout']);
});


Route::group([
    'middleware' => ['jwt.auth', 'jwt.role:'.\App\User::DRIVER_PERMISSION]
], function () {
    Route::resource('v1/car', "Api\\Car\\CarController");
    Route::resource('v1/car-body', 'Api\\Car\\CarBodyController', ['only' => ['index']]);
    Route::resource('v1/car-color',  'Api\\Car\\CarColorController', ['only' => ['index']]);
    Route::resource('v1/car-brand', 'Api\\Car\\CarBrandController', ['only' => ['index']]);
    Route::get('v1/car-brand/{model}/models', 'Api\\Car\\CarBrandController@getModelByMarkId');
});


Route::group([
    'prefix' => 'v1/trips',
    'as' => 'trips.',
    'middleware' => ['jwt.auth', 'jwt.role:'.\App\User::DRIVER_PERMISSION],
], function () {
    Route::get('/', ['as' => 'all', 'uses' => 'TripsController@getAll']);
    Route::get('/upcoming', ['as' => 'upcoming', 'uses' => 'TripsController@getUpcoming']);
    Route::get('/past', ['as' => 'past', 'uses' => 'TripsController@getPast']);
    Route::post('/', ['as' => 'create', 'uses' => 'TripsController@create']);
    Route::get('show/{trip}', ['as' => 'show', 'uses' => 'TripsController@show']);
    Route::put('{trip}', ['as' => 'update', 'uses' => 'TripsController@update']);
    Route::delete('{trip}', ['as' => 'delete', 'uses' => 'TripsController@delete']);
    Route::delete('trash/{tripId}', ['as' => 'restore', 'uses' => 'TripsController@restore']);
});

Route::middleware('jwt.guest')->post('v1/password-resets', ['as' => 'password.forgot', 'uses' => 'Auth\PasswordResetsController@forgot']);
Route::middleware('jwt.guest')->put('v1/password-resets', ['as' => 'password.reset', 'uses' => 'Auth\PasswordResetsController@reset']);


