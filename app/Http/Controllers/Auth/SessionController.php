<?php

namespace App\Http\Controllers\Auth;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Transformers\User\SessionDataTransformer;

class SessionController extends Controller
{
    /**
     * Get the session user data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSessionUser()
    {
        return fractal(Auth::user(), new SessionDataTransformer())->respond();
    }

    /**
     * Refresh the session user data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return response()->json();
    }
}
