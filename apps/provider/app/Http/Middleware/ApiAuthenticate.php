<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Http\Request;

class ApiAuthenticate extends Authenticate
{
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }
}
