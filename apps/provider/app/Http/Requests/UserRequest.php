<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Validation\Rules\Password;

class UserRequest extends ValidateRequest
{
    protected function getRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:' . User::class . ',email'],
            'password' => ['required', 'string', 'min:8', 'max:255', Password::default()],
        ];
    }
}
