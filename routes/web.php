<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/*
Route::get('/', function () {
    return view('welcome');
})->name('/');
/*
Auth::routes([
    'verify' => true,
]);

Route::get('register', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('register', [App\Http\Controllers\Auth\RegisterController::class, 'sendVerify']);

Route::get('/', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('/', [App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::post('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

Route::get('register/verify', [App\Http\Controllers\Auth\RegisterController::class, 'showVerifyForm'])->name('confirmRegister');
Route::post('register/verify', [App\Http\Controllers\Auth\RegisterController::class, 'verify']);

Route::get('/home', function (){
    return view('home');
})->name('home');
*/

Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');
