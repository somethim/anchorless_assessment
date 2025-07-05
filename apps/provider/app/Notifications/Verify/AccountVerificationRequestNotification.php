<?php

namespace App\Notifications\Verify;

use App\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;

class AccountVerificationRequestNotification extends Notification
{
    public function __construct(protected string $email, protected string $_id)
    {
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(): MailMessage
    {
        $url = URL::temporarySignedRoute(
            'verify.account.email',
            now()->addMinutes(30),
            [
                'id' => $this->_id,
                'hash' => sha1($this->email),
            ]
        );

        return (new MailMessage())
            ->subject('Account Verification Request')
            ->line('Please verify your account.')
            ->action('Verify Account', $url)
            ->line('If you did not create an account, no further action is required.')
            ->line('------------------------------------------')
            ->line('If you have any questions or concerns, you can also visit our Support portal at ' . url('/') . '.');
    }
}
