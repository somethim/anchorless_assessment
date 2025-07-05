<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAccountIsVerifiedMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isVerified()) {
            return response()->json(['message' => 'Account not verified'], 403);
        }

        return $next($request);
    }
}
