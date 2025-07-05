<?php

namespace App\Models;

use App\Traits\HasTimestamps;
use App\Traits\HasUuids;
use App\Utils\NotificationHelpers\Auth as AuthNotification;
use App\Utils\PasswordValidator;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Jenssegers\Agent\Agent;
use Throwable;

class SessionAudit extends Model
{
    use HasUuids;
    use HasTimestamps;

    protected $casts = [
        'user_uuid' => 'string',
        'session_id' => 'string',
        'session_id_hash' => 'hashed',
        'user_agent' => 'string',
        'ip_address' => 'string',
        'platform' => 'string',
    ];

    protected $hidden = [
        'session_id_hash',
    ];

    /**
     * @throws AuthenticationException
     * @throws Throwable
     */
    public static function terminate_all_sessions(string $password): void
    {
        DB::transaction(function () use ($password) {
            $authAccount = auth()->user();
            if (!$authAccount) {
                throw new AuthenticationException('User not authenticated.');
            }
            if (!PasswordValidator::check($password, $authAccount)) {
                throw new AuthenticationException('Invalid password.');
            }

            $current = $authAccount->sessions()->get()->first(fn (SessionAudit $s) => Hash::check(session()->getId(), $s->session_id_hash));
            if (!($current instanceof SessionAudit)) {
                throw new AuthenticationException('Session not found.');
            }

            Auth::logoutOtherDevices($password);
            $authAccount->sessions()->where('_id', '!=', $current->_id)->delete();

            AuthNotification::sendSessionTerminatedNotification($current, true);
        });
    }

    protected static function booted(): void
    {
        static::retrieved(function (SessionAudit $model) {
            $model->user_agent = Crypt::decrypt($model->user_agent);
            $model->ip_address = Crypt::decrypt($model->ip_address);
            $model->platform = Crypt::decrypt($model->platform);
            $model->session_id = Crypt::decrypt($model->session_id);
        });

        static::creating(function (SessionAudit $model) {
            $agent = new Agent();

            $model->user_uuid = auth()->user()->_id;
            $model->session_id = Crypt::encrypt(session()->getId());
            $model->session_id_hash = Hash::make(session()->getId());
            $model->ip_address = Crypt::encrypt(request()->ip());
            $model->user_agent = Crypt::encrypt($agent->getUserAgent());
            $model->platform = Crypt::encrypt($agent->platform());
        });


    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, '', '_id');
    }
}
