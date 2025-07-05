<?php

namespace App\Http\Requests\Auth\Reset;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password;

class NewPasswordRequest extends FormRequest
{
    private User $user;

    public function authorize(): bool
    {
        if ($this->route('id') && $this->route('hash')) {
            return $this->authorizeEmail();
        }
        if ($this->input('code') && $this->session()->has('password_reset_id')) {
            return $this->authorizePhone();
        }

        return false;
    }

    private function authorizeEmail(): bool
    {
        if (!URL::hasValidSignature($this)) {
            return false;
        }

        $user = User::find($this->route('id'));
        if (!$user) {
            return false;
        }
        $this->user = $user;


        if (!hash_equals((string) $user->getKey(), (string) $this->route('id'))) {
            return false;
        }
        if (!hash_equals(sha1($user->getIdForVerification()), (string) $this->route('hash'))) {
            return false;
        }

        return true;
    }

    private function authorizePhone(): bool
    {
        $user = User::where('email', $this->session()->pull('password_reset_id'))->first();
        if (!$user) {
            return false;
        }
        $this->user = $user;

        $cachedCode = cache()->pull("password_reset:$user->email");
        if (!$cachedCode || $cachedCode !== $this->input('code')) {
            return false;
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'password' => ['required', 'string', 'min:8', 'max:255', Password::defaults()],
            'code' => ['nullable', 'string', 'size:6', 'regex:/^[0-9]+$/'],
        ];
    }

    public function fulfill(): void
    {
        $this->user->forceFill([
            'password' => Hash::make($this->validated('password')),
        ])->save();
    }
}
