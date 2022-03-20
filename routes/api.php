<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Route::group(['middleware' => ['web']], function () {
Route::group([
    'middleware' => 'guest',
    ], function ($router) {*/
    //Route::get('register', [App\Http\Controllers\Auth\RegisterController::class, 'sendVerify']);

    Route::middleware(['guest'])->group(function () {
    Route::post('register', [App\Http\Controllers\Auth\RegisterController::class, 'sendVerify']);

    Route::get('/', [App\Http\Controllers\Auth\LoginController::class, 'login'])->name('login');
    Route::post('login', [App\Http\Controllers\Auth\LoginController::class, 'login']);

    Route::post('register/verify/token', [App\Http\Controllers\Auth\RegisterController::class, 'isTokenTrue']);
    Route::post('register/verify', [App\Http\Controllers\Auth\RegisterController::class, 'setStatus']);
    Route::post('register/verify/resend', [App\Http\Controllers\Auth\RegisterController::class, 'resendEmail']);
    Route::post('register/verify/1', [App\Http\Controllers\Auth\RegisterController::class, 'firstStep']);
    Route::post('register/verify/2', [App\Http\Controllers\Auth\RegisterController::class, 'secondStep']);
    Route::post('register/verify/3', [App\Http\Controllers\Auth\RegisterController::class, 'thirdStep']);
    Route::post('register/getData', [App\Http\Controllers\Auth\RegisterController::class, 'getData']);
    });

    Route::get('products', [App\Http\Controllers\ProductController::class, 'authCheck']);

    Route::middleware(['auth'])->group(function () {
        Route::post('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

        Route::get('products/all', [App\Http\Controllers\ProductController::class, 'getProducts']);
        Route::get('products/addictions', [App\Http\Controllers\ProductController::class, 'getAddictions']);
    });


