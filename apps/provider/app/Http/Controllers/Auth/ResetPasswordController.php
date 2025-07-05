<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\Reset\NewPasswordRequest;
use App\Http\Requests\Auth\Reset\PasswordResetLinkRequest;
use App\Models\SessionAudit;
use App\Models\User;
use App\Utils\NotificationHelpers\PasswordReset;
use Illuminate\Http\JsonResponse;
use Throwable;

class ResetPasswordController extends Controller
{
    /**
     * Send a password reset link to the user.
     */
    public function send(PasswordResetLinkRequest $request): JsonResponse
    {
        try {
            $user = User::where('email', $request->validated('email'))->first();
            if (!$user) {
                return response()->json(['status' => 'Password reset link sent']);
            }
            session()->put('password_reset_id', $user->email);

            $user->dispatchPasswordResetNotification();

            return response()->json(['status' => 'Password reset link sent']);
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    /**
     * Reset your password
     */
    public function reset(NewPasswordRequest $request): JsonResponse
    {
        try {
            $request->fulfill();
            SessionAudit::terminate_all_sessions($request->validated('password'));
            PasswordReset::sendPasswordResetSuccessNotification(auth()->user()->email);

            return response()->json(['status' => 'Password has been reset successfully']);
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }
}
