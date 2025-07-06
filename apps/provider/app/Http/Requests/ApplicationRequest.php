<?php

namespace App\Http\Requests;

use App\Enums\AttachmentType;
use App\Models\Attachment;
use Illuminate\Validation\Rule;

class ApplicationRequest extends ValidateRequest
{
    protected function getRules(): array
    {
        return [
            'attachments' => ['array', 'nullable', 'min:1', 'max:27'],
            'attachments.*.file' => [
                'required',
                'file',
                'max:' . config('filesystems.max_file_size'),
                'mimes:' . config('filesystems.allowed_extensions'),
            ],
            'attachments.*.type' => ['string', Rule::enum(AttachmentType::class)],
            'remove' => ['array', 'nullable', 'min:1', 'max:27'],
            'remove.*' => ['string', 'exists:' . Attachment::class . ',_id', 'distinct'],
        ];
    }
}
