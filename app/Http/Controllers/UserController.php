<?php

namespace App\Http\Controllers;


use App\User;
use App\Role;
use App\RoleUser;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RegistrationFormRequest;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    /**
     * @var bool
     */
    public $loginAfterSignUp = true;

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $input = $request->only('email', 'password');
        $token = null;

        if (!$token = JWTAuth::attempt($input)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email or Password',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'token' => $token,
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function logout(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        try {
            JWTAuth::invalidate($request->token);

            return response()->json([
                'success' => true,
                'message' => 'User logged out successfully'
            ]);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, the user cannot be logged out'
            ], 500);
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $user = new User();
        $user->name = $request->name;
        $user->surname = $request->surname;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->university_id = $request->university_id;
        $user->save();

        if ($this->loginAfterSignUp) {
            return $this->login($request);
        }

        return response()->json([
            'success'   =>  true,
            'data'      =>  $user
        ], 200);
    }

    public function updateRole(Request $request) {
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        if(Auth::user()->role()=='ADMIN' && $request->input('role') != 'ADMIN') {
            $changeRole = User::where('email', $request->input('email'))->first();
            if(is_null($changeRole)){
                $error = 'utente non trovato';
                return response()->json($error,Response::HTTP_NOT_FOUND);
            } else if($changeRole->role != 'ADMIN'){
                $changeRole->role = $request->input('role');
                $changeRole->update();
                $message['message'] = 'Il ruolo e\' stato aggiornato con sucesso in: '.$changeRole->role;
                return response()->json($message,Response::HTTP_OK);
            } else {
                $error = 'Non puoi cambiare il ruolo di questo utente';
                return rospose()->json($error,Response::HTTP_BAD_REQUEST);
            }
        } else {
            $error = 'Non si dispone dei permessi per effettuare questa operazione';
            return response()->json($error,Response::HTTP_BAD_REQUEST);
        }
    }

    public function remove(Request $request) {
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        if(Auth::user()->role=='ADMIN') {
            $changeRole = User::all()->find($request->input('id'));
            $changeRole->destroy();
            return response()->json(Response::HTTP_OK);
        } else {
            $error = 'non si dispone dei permessi per effettuare questa operazione';
            return response()->json($error, Response::HTTP_BAD_REQUEST);
        }
    }
}
