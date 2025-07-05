<?php

namespace App\Notifications\Verify;

use App\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AccountVerifiedNotification extends Notification
{
    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
    }

    /**
     * Email representation of the notification.
     */
    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->subject('Account Verified')
            ->line('Your account has been successfully verified.')
            ->action('Go to Dashboard', url('/'))
            ->line('------------------------------------------')
            ->line('If you have any questions or concerns, you can also visit our Support portal at ' . url('/') . '.');
    }
}
