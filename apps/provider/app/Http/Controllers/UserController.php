<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Services\UserService;
use App\Models\SessionAudit;
use App\Utils\PasswordValidator;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Throwable;

class UserController extends Controller
{
    public function __construct(protected UserService $service)
    {
    }

    public function show(): JsonResponse
    {
        try {
            return response()->json(auth()->user());
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    public function update(UserRequest $request): JsonResponse
    {
        try {
            return response()->json($this->service->update($request->validated()));
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    public function forgot_password(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'oldPassword' => ['required', 'string', 'min:8', 'max:255', Password::defaults()],
                'password' => ['required', 'string', 'min:8', 'max:255', Password::defaults()],
            ]);
            if (!PasswordValidator::check($validated['oldPassword'], $request->user()->password)) {
                return response()->json(['message' => 'Old password is incorrect.'], 422);
            }

            $request->user()->forceFill(
                ['password' => Hash::make($validated['password'])]
            );

            SessionAudit::terminate_all_sessions($validated['oldPassword']);

            return response()->json(['message' => 'Password updated successfully. All other sessions have been terminated for security.']);
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    public function terminate_all_sessions(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'password' => ['required', 'string', 'min:8', 'max:255', Password::defaults()],
            ]);

            SessionAudit::terminate_all_sessions($validated['password']);

            return response()->json(['message' => 'Sessions terminated successfully.']);
        } catch (Throwable $e) {

            return $this->sendErrorResponse($e);
        }
    }

    public function destroy(): JsonResponse
    {
        try {
            $this->service->destroy(auth()->user()->_id);

            return response()->json([
                'message' => 'User deleted successfully.',
            ], 204);
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }
}
