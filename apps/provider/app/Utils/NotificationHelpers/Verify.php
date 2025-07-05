<?php

namespace App\Utils\NotificationHelpers;

use App\Notifications\Verify\AccountVerificationRequestNotification;
use App\Notifications\Verify\AccountVerifiedNotification;
use App\Utils\NotificationHelpers;
use Exception;
use Illuminate\Support\Facades\Notification;

class Verify
{
    public static function sendVerificationRequestNotification(string $email, string $_id): void
    {
        try {
            if (NotificationHelpers::isValidEmail($email)) {
                Notification::route('mail', $email)->notify(new AccountVerificationRequestNotification($email, $_id));
            } else {
                throw new Exception('Invalid provider account ID');
            }
        } catch (Exception $e) {
            logger()->error($e->getMessage());
        }
    }

    public static function sendVerificationSuccessNotification(string $email): void
    {
        try {
            if (NotificationHelpers::isValidEmail($email)) {
                Notification::route('mail', $email)->notify(new AccountVerifiedNotification());
            } else {
                throw new Exception('Invalid provider account ID');
            }
        } catch (Exception $e) {
            logger()->error($e->getMessage());
        }
    }
}
