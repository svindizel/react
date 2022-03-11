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
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\EmailVerify;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;


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
    protected function validateEmail(array $data)
    {
        return Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);
    }

    protected function validateImage()
    {
        return Validator::make($data, [
            'logo' => ['required, mimes:jpeg,bmp,png', 'max:3000', 'dimensions:min_width=300,min_height=300']
        ]);
    }

    protected function validatePassword(array $data)
    {
        return Validator::make($data, [
            'password' => ['required', 'string', 'min:8'],
        ]);
    }

    protected function validateInn(array $data)
    {
        return Validator::make($data, [
            'inn' => ['required', 'string'],
            //'confirm_password' => ['required', 'string', 'max:255'],
        ]);
    }

    public function showRegistrationForm()
    {
        return view('welcome');
    }

    public function sendVerify(Request $request)
    {
        $this->validateEmail($request->all())->validate()['email'];

        $email = $request->input('email');

        if (User::where('email', $email)->exists()) {

            return new JsonResponse(response()->json([
                'error' => "User exists!",
            ]), 422);

        } elseif (EmailVerify::where('email', $email)->exists()) {

            return new JsonResponse(response()->json(['error' => 'You have already received a letter!']), 422);

        } else {
            $url = str_replace('api/register','', URL::current()) . 'registration?token=' . $request->_token;

            Mail::send('mail', ['email' => $email, 'url' => $url], function ($message) use ($email) {
                $message->to($email)->subject('Продолжение регистрации');
                $message->from('admin@admin.ru', 'Admin');
            });

            EmailVerify::create([
                'email' => $email,
                'token' => $request->_token,
            ]);
        }

        return $request->wantsJson()
                    ? new JsonResponse('success', 201)
                    : redirect($this->redirectPath());
    }

    public function showVerifyForm(Request $request)
    {
        return view('welcome');
    }

    public function firstStep(Request $request)
    {   
        DB::table('email_verifies')
            ->where('token', $request->token)
            ->update(['status' => 1]);

        $email = DB::table('email_verifies')
                    ->select('email')
                    ->where('token', $request->token)
                    ->get()[0]->email;

        $this->validateInn($request->only('inn'))->validate();

        if (User::where('email', $email)->exists()) {
            DB::table('users')
                ->where('email', $email)
                ->update(['inn' => $request->inn, 'name' => $request->companyName]);

            return new JsonResponse(response()->json([
                'name' => $request->companyName,
                'email' => $email,
                'inn' => $request->inn,
                'stage' => 1
            ]), 201);
        }

        User::create([
            'name' => $request->companyName,
            'email' => $email,
            'inn' => $request->inn,
            'stage' => 1
        ]);

        return new JsonResponse(response()->json([
            'name' => $request->companyName,
            'email' => $email,
            'inn' => $request->inn,
            'stage' => 1
        ]), 201);
    }

    public function secondStep(Request $request)
    {
        dd($request->file('logo'));
        //$this->validateImage($request->all())->validate()['logo'];
        //валидация
      /*  DB::table('users')
        ->where('email', $var)
        ->update(['logo' => $var, 'stage' => 2]);*/
    }

    public function thirdStep(Request $request)
    {
        $this->validatePassword($request->only('password'))->validate();

        $email = DB::table('email_verifies')
            ->select('email')
            ->where('token', $request->token)
            ->get()[0]->email;

        DB::table('users')
            ->where('email', $email)
            ->update(['password' => Hash::make($request->password), 'stage' => 3]);

        if (Auth::attempt([
            'email' => $email, 
            'password' => $request->password
        ])) {
            return true;
        }

        return new JsonResponse('success', 201);
    }
    /*
        event(new Registered($user = $this->create($request->all())));

        
    
        if ($response = $this->registered($request, $user)) {
            return $response;
        }

        return $request->wantsJson()
                    ? new Response('', 201)
                    : redirect($this->redirectPath());
        //$this->validator($request->all())->validate();
    }*/
    

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
        /*
        $dir = str_replace('app\Http\Controllers\Auth', 'tmp\\' , __DIR__);

        $f = fopen($dir . md5($data['companyName']). '.txt' , "w+");
        fputs($f, $data['logo']); // Запись в файл
        fclose($f); //Закрытие файла
*/
        return User::where([
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'inn' => $data['inn'],
            //'logo' => 'tmp\\' . md5($data['companyName']). '.txt'
        ]);
    }
}
