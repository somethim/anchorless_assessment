<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

abstract class Notification extends \Illuminate\Notifications\Notification implements ShouldQueue
{
    use Queueable;

    abstract public function toMail(): MailMessage;

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     *
     * @return array
     */
    public function via(mixed $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toArray(mixed $notifiable): array
    {
        return [
            'channel' => $this->via($notifiable),
            'type' => static::class,
            'data' => $this->toMail()->toArray(),
        ];
    }

    public function toDatabase(mixed $notifiable): array
    {
        return $this->toArray($notifiable);
    }
}
