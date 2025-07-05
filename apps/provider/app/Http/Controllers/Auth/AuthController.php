<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthRequest;
use App\Http\Services\AuthService;
use App\Models\SessionAudit;
use App\Utils\NotificationHelpers;
use DB;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService,
    ) {
    }

    /**
     * Handle direct authentication
     */
    public function store(AuthRequest $request): JsonResponse
    {
        try {
            $session = DB::transaction(function () use ($request) {
                $data = $request->validated();
                $request->session()->put('remember', $request->validated('remember', false));

                $this->authService->authenticate($data);
                $request->session()->regenerate();

                return SessionAudit::create();
            });
            NotificationHelpers\Auth::sendAuthenticatedNotification($session);

            return response()->json($request->user());
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            SessionAudit::where('session_id', $request->session()->getId())->delete();
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json(['message' => 'Signed Out'], 204);
        } catch (Exception $e) {
            return $this->sendErrorResponse($e);
        }
    }
}
