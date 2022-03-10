<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

class HomeController extends Controller
{
    //use LoginController;

    public function __construct()
    {
        //$this->middleware('auth');
    } 

    public function index()
    {
        /*
        if ($request->path() == '/' && $request->method() == 'POST') {
            $login = new LoginController;
            $login->login($request);
        }

        if ($request->path() == '/register') {
            $register = new RegisterController;
            $register->sendVerify($request);
        }*/

        return view('welcome');
    }
}
