<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Events\Registered;
//use App\Http\Controllers\Auth\Response;
use Illuminate\Http\JsonResponse;
use App\Models\EmailVerify;
use Illuminate\Support\Facades\DB;

use Mail;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    //public const HOME = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            //'copmanyName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
            //'inn' => ['required', 'string', 'max:255'],
        ]);
    }

    public function showRegistrationForm()
    {
        return view('welcome');
    }

    public function sendVerify(Request $request)
    {
        //$this->validator($request->all())->validate();
        dd($request);
        $email = $request->input('email');
        $url = URL::current() . '/verify?token=' . sha1($email);
        $verif = DB::table('email_verifies')->where('email', $email)->get();
        $users = DB::table('users')->where('email', $email)->get();

        if (empty($users->items) && empty($verif->items)) {

            Mail::send('mail', ['email' => $email, 'url' => $url], function ($message) use ($email) {
                $message->to($email)->subject('Продолжение регистрации');
                $message->from('admin@admin.ru', 'Admin');
            });

            EmailVerify::create([
                'email' => $email,
                'token' => sha1($email),
                //'status' => 1,
            ]);
        }

        return $request->wantsJson()
                    ? new JsonResponse('', 201)
                    : redirect($this->redirectPath());
    }

    public function showVerifyForm(Request $request)
    {
        return view('welcome');
    }

    public function verify(Request $request)
    {
        //$this->validator($request->all())->validate();
        event(new Registered($user = $this->create($request->all())));

        $this->guard()->login($user);

        if ($response = $this->registered($request, $user)) {
            return $response;
        }

        return $request->wantsJson()
                    ? new Response('', 201)
                    : redirect($this->redirectPath());
        //$this->validator($request->all())->validate();
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        //$path = 'tmp\\' . substr(md5(microtime()), mt_rand(0, 30), 2) . '\\';
        //. md5($data['companyName']). '.txt'
        
        $dir = str_replace('app\Http\Controllers\Auth', 'tmp\\' , __DIR__);

        $f = fopen($dir . md5($data['companyName']). '.txt' , "w+");
        fputs($f, $data['logo']); // Запись в файл
        fclose($f); //Закрытие файла

        return User::create([
            'name' => $data['companyName'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'inn' => $data['inn'],
            'logo' => 'tmp\\' . md5($data['companyName']). '.txt'
        ]);
    }
}
