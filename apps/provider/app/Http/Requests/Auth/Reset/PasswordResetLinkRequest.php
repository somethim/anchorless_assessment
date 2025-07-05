<?php

namespace App\Http\Requests\Auth\Reset;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class PasswordResetLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'exists:' . User::class . ',email'],
        ];
    }
}
