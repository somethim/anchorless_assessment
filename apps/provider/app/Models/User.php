<?php

namespace App\Models;

use App\Traits\HasTimestamps;
use App\Traits\HasUuids;
use App\Utils\NotificationHelpers\PasswordReset;
use App\Utils\NotificationHelpers\Verify;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasTimestamps;
    use HasUuids;

    protected $fillable = [
        'name',
        'email',
        'password',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        '_verifiedAt' => 'datetime',
        'password' => 'hashed',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(SessionAudit::class, 'user_uuid', '_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'user_uuid', '_id');
    }

    protected static function booted(): void
    {
        static::created(function (User $user) {
            Verify::sendVerificationRequestNotification($user->email, $user->_id);
        });

        static::deleted(function (User $user) {
            if ($user->sessions()->exists()) {
                $user->sessions()->delete();
            }
            if ($user->applications()->exists()) {
                $user->applications()->delete();
            }
        });
    }

    /**
     * Mark the account as verified, send appropriate notifications
     */
    public function markAsVerified(): void
    {
        $this->forceFill([
            '_verifiedAt' => $this->freshTimestamp(),
        ])->save();

        Verify::sendVerificationSuccessNotification($this->email);
    }

    /**
     * Check if the account is verified
     */
    public function isVerified(): bool
    {
        return !is_null($this->_verifiedAt);
    }

    public function dispatchPasswordResetNotification(): void
    {
        PasswordReset::sendPasswordResetRequestNotification($this->email, $this->_id);
    }

    public function getIdForVerification(): string
    {
        return $this->email;
    }
}
