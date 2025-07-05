<?php

namespace App\Http\Services;

use App\Models\User;
use Throwable;

class UserService
{
    /**
     * @throws Throwable
     */
    public function update(array $validated): User
    {
        $user = auth()->user();
        $user->updateOrFail($validated);

        return $user;
    }

    /**
     * @throws Throwable
     */
    public function destroy(string $user): void
    {
        User::findOrFail($user)->deleteOrFail();
    }
}
