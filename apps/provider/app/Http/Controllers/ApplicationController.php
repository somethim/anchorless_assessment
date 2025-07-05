<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApplicationRequest;
use App\Http\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ApplicationController extends Controller
{
    public function __construct(protected ApplicationService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        try {
            return response()->json($this->paginate($request, $this->service->index(auth()->user()->_id)));
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    public function store(ApplicationRequest $request): JsonResponse
    {
        try {
            return response()->json($this->service->store($request->validated('user_uuid'), $request->validated('attachments')), 201);
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    public function show(string $current_user): JsonResponse
    {
        try {
            return response()->json($this->service->show($current_user));
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    public function update(ApplicationRequest $request, string $current_user, string $application): JsonResponse
    {
        try {
            return response()->json($this->service->update($application, $request->validated('user_uuid'), $request->validated('attachments'), $request->validated('remove')));
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }

    public function destroy(string $current_user, string $application): JsonResponse
    {
        try {
            $this->service->destroy($application);

            return response()->json(['message' => 'Application deleted successfully.'], 204);
        } catch (Throwable $e) {
            return $this->sendErrorResponse($e);
        }
    }
}
