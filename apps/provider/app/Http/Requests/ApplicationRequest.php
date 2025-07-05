<?php

namespace App\Http\Requests;

use App\Models\Attachment;
use App\Models\User;

class ApplicationRequest extends ValidateRequest
{
    protected function getRules(): array
    {
        return [
            'user_uuid' => ['required', 'string', 'exists:' . User::class . ',_id'],
            'attachments' => ['array', 'nullable', 'min:1'],
            'attachments.*' => ['required', 'file', 'max:' . config('filesystems.max_file_size')],
            'remove' => ['array', 'nullable', 'min:1'],
            'remove.*' => ['string', 'exists:' . Attachment::class . ',_id', 'distinct'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'user_uuid' => $this->route('current_user'),
        ]);
    }
}
