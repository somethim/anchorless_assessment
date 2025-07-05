<?php

namespace App\Notifications\PasswordReset;

use App\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordResetSuccessNotification extends Notification
{
    public function __construct()
    {
    }

    /**
     * Email representation of the notification.
     */
    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->subject('Password Reset')
            ->line('Your password has been successfully reset. You have also been logged out of all your sessions for security reasons.')
            ->line('------------------------------------------')
            ->line('If you did not request this change, please contact support immediately.')
            ->line('------------------------------------------')
            ->line('If you have any questions or concerns, you can also visit our Support portal at ' . url('/') . '.');
    }
}
