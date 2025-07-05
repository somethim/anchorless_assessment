<?php

namespace App\Utils;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PasswordValidator
{
    public static function check(string $password, User $user): bool
    {
        (new self())->ensureIsNotRateLimited($user->email);
        if (!Hash::check($password, $user->password)) {
            RateLimiter::hit((new self())->throttleKey($user->email));

            return false;
        }
        RateLimiter::clear((new self())->throttleKey($user->email));

        return true;
    }

    private function ensureIsNotRateLimited(string $email): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($email), 5)) {
            return;
        }
        event(new Lockout(request()));

        $seconds = RateLimiter::availableIn($this->throttleKey($email));

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    private function throttleKey(string $email): string
    {
        return Str::transliterate(Str::lower($email) . '|' . request()->ip());
    }
}
