<?php

namespace App\Notifications\Auth;

use App\Models\SessionAudit;
use App\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AuthenticatedSuccessfullyNotification extends Notification
{
    public function __construct(protected string $email, protected SessionAudit $session)
    {
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->subject('New Login Alert')
            ->greeting('Hello,')
            ->line('This account was used to access your account from a new device or location.')
            ->line('------------------------------------------')
            ->line("Account ID: {$this->session->user->_id}")
            ->line("Email: $this->email")
            ->line("Time: {$this->session->_createdAt}")
            ->line("IP Address: {$this->session->ip_address}")
            ->line("Browser: {$this->session->user_agent}")
            ->line('------------------------------------------')
            ->line('If this was you, you can ignore this alert. If you noticed any suspicious activity on your account, please change your password and enable two-factor authentication on your account page at ' . url('/'))
            ->line('If you have any questions or concerns, you can also visit our Support portal at ' . url('/') . '.');
    }
}
