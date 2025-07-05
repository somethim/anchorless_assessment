<?php

namespace App\Utils\NotificationHelpers;

use App\Models\SessionAudit;
use App\Notifications\Auth\AuthenticatedSuccessfullyNotification;
use App\Notifications\Auth\SessionTerminatedNotification;
use App\Utils\NotificationHelpers;
use Exception;
use Illuminate\Support\Facades\Notification;

class Auth
{
    public static function sendAuthenticatedNotification(SessionAudit $session): void
    {
        try {
            if (NotificationHelpers::isValidEmail($session->user->email)) {
                Notification::route('mail', $session->user->email)->notify(new AuthenticatedSuccessfullyNotification($session->user->email, $session));
            } else {
                throw new Exception('Invalid provider account ID');
            }
        } catch (Exception $e) {
            logger()->error($e->getMessage());
        }
    }

    public static function sendSessionTerminatedNotification(SessionAudit $session, bool $terminate_all): void
    {
        try {
            if (NotificationHelpers::isValidEmail($session->user->email)) {
                Notification::route('mail', $session->user->email)
                    ->notify(new SessionTerminatedNotification($session->user->email, $session, $terminate_all));
            } else {
                throw new Exception('Invalid provider account ID');
            }
        } catch (Exception $e) {
            logger()->error($e->getMessage());
        }
    }
}
