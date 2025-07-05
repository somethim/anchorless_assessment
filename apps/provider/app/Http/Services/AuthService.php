<?php

namespace App\Http\Services;

use App\Models\User;
use App\Utils\PasswordValidator;
use Exception;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthService
{
    /**
     * @throws Throwable
     */
    public function authenticate(array $data): void
    {
        $this->ensureIsNotRateLimited($data['email']);

        try {
            $this->handle($data);
            RateLimiter::clear($this->throttleKey($data['email']));
        } catch (Throwable $e) {
            RateLimiter::hit($this->throttleKey($data['email']));
            throw $e;
        }
    }

    /**
     * @throws ValidationException
     */
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

    /**
     * @throws Throwable
     */
    private function handle(array $data): void
    {
        $user = User::where('email', $data['email'])->first();
        if ($user) {
            if (is_null($user->password)) {
                $user->updateOrFail([
                    'password' => $data['password'],
                    '_verifiedAt' => now(),
                ]);
            }
            if (!$user->isVerified()) {
                throw new Exception('Account is not verified', 409);
            }

            if (!PasswordValidator::check($data['password'], $user)) {
                throw ValidationException::withMessages(['email' => __('auth.failed')]);
            }
            Auth::login($user, session()->pull('remember'));

            return;
        }

        DB::transaction(function () use ($data) {
            $user = User::create($data);
            Auth::login($user, session()->pull('remember'));
        });
    }
}
