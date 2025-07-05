<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\EmailVerificationRequest;
use Exception;
use Illuminate\Http\JsonResponse;

class VerifyEmailController extends Controller
{
    /**
     * Verify your email
     */
    public function __invoke(EmailVerificationRequest $request): JsonResponse
    {
        try {
            $request->fulfill();

            return response()->json(['message' => 'Verified']);
        } catch (Exception $e) {
            return $this->sendErrorResponse($e);
        }
    }
}
