<?php

namespace App\Notifications\PasswordReset;

use App\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use URL;

class ResetPasswordRequestNotification extends Notification
{
    /**
     * Create a new notification instance.
     */
    public function __construct(protected string $email, protected string $_id)
    {
    }

    /**
     * Email representation of the notification.
     */
    public function toMail(): MailMessage
    {
        $url = URL::temporarySignedRoute(
            'password.reset.reset',
            now()->addMinutes(30),
            [
                'id' => $this->_id,
                'hash' => sha1($this->email),
            ]
        );

        return (new MailMessage())
            ->subject('Password Reset Request')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $url)
            ->line('This password reset link will expire in 30 minutes.')
            ->line('If you did not request a password reset, no further action is required.')
            ->line('------------------------------------------')
            ->line('If you have any questions or concerns, you can also visit our Support portal at ' . url('/') . '.');
    }
}
