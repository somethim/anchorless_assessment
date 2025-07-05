<?php

namespace App\Utils;

class NotificationHelpers
{
    public static function isValidEmail(string $email): bool
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        $domain = substr(strrchr($email, '@'), 1);

        return checkdnsrr($domain);
    }
}
