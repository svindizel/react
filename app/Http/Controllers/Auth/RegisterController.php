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

    public function validateImage(array $data)
    {
        return Validator::make($data, [
            'logo' => 'mimes:jpeg,jpg,png|max:3000|dimensions:max_width=300,max_height=300'
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
        ]);
    }

    public function sendVerify(Request $request)
    {
        $this->validateEmail($request->all())->validate()['email'];

        $email = $request->input('email');

        if (User::where('email', $email)->exists()) {

            $url = str_replace('api/register','', URL::current()) . 'registration?token=' . $request->_token . '&stage=' . User::where('email', $email)->value('stage');

            Mail::send('mail', ['email' => $email, 'url' => $url], function ($message) use ($email) {
                $message->to($email)->subject('Продолжение регистрации');
                $message->from('admin@admin.ru', 'Admin');
            });

            return new JsonResponse(response()->json([
                'isExists' => User::where('email', $email)->exists(),
            ]), 200);

        } elseif (EmailVerify::where('email', $email)->where('status', 1)->exists()) {

            return new JsonResponse(response()->json(['error' => 'You have already received a letter!']), 200);

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
                    ? new JsonResponse('success', 200)
                    : redirect($this->redirectPath());
    }

    public function setStatus(Request $request)
    {
        DB::table('email_verifies')
        ->where('token', $request->token)
        ->update(['status' => 1]);

        return new JsonResponse(response()->json('success', 200));
    }

    public function isTokenTrue(Request $request)
    {
        if (DB::table('email_verifies')
        ->where('token', $request->token)
        ->exists()
        )
        {
            return new JsonResponse(response()->json(['isTokenTrue' => true], 200));
        }
        return new JsonResponse(response()->json(['isTokenTrue' => false], 200));
    }

    public function firstStep(Request $request)
    {
        if (DB::table('email_verifies')
            ->where('token', $request->token)
            ->exists()
        )
        {
            $email = DB::table('email_verifies')
                        ->select('email')
                        ->where('token', $request->token)
                        ->value('email');

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
                ]), 200);
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
            ]), 200);
        }

        return new JsonResponse(response()->json([
            'error' => 'Incorrect token',
        ]), 200);
    }

    public function secondStep(Request $request)
    {
        if (DB::table('email_verifies')
            ->where('token', $request->token)
            ->exists()
        )
        {
            $this->validateImage($request->all())->validate()['logo'];

            $path = $request->logo->store('logo');
            
            $email = DB::table('email_verifies')
                        ->select('email')
                        ->where('token', $request->token)->get()[0]->email;

            DB::table('users')
                ->where('email', $email)
                ->update(['logo' => $path, 'stage' => 2]);

            return new JsonResponse(response()->json([
                'logo' => $path,
                'stage' => 2
            ]));
        }
        return new JsonResponse(response()->json([
            'error' => 'Incorrect token',
        ]), 200);
    }

    public function thirdStep(Request $request)
    {
        if (DB::table('email_verifies')
        ->where('token', $request->token)
        ->exists()
        )
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

            return new JsonResponse('success', 200);
        }

        return new JsonResponse(response()->json([
            'error' => 'Incorrect token',
        ]), 200);
    }
    

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
}
