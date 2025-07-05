<?php

namespace App\Utils\NotificationHelpers;

use App\Notifications\PasswordReset\PasswordResetSuccessNotification;
use App\Notifications\PasswordReset\ResetPasswordRequestNotification;
use App\Utils\NotificationHelpers;
use Exception;
use Illuminate\Support\Facades\Notification;

class PasswordReset
{
    public static function sendPasswordResetRequestNotification(string $email, string $id): void
    {
        try {
            if (NotificationHelpers::isValidEmail($email)) {
                Notification::route('mail', $email)
                    ->notify(new ResetPasswordRequestNotification($email, $id));
            } else {
                throw new Exception('Invalid provider account ID');
            }
        } catch (Exception $e) {
            logger()->error($e->getMessage());
        }
    }

    public static function sendPasswordResetSuccessNotification(string $email): void
    {
        try {
            if (NotificationHelpers::isValidEmail($email)) {
                Notification::route('mail', $email)->notify(new PasswordResetSuccessNotification());
            } else {
                throw new Exception('Invalid provider account ID');
            }
        } catch (Exception $e) {
            logger()->error($e->getMessage());
        }
    }
}
