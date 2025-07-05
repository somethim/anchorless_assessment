<?php

namespace App\Models;

use App\Traits\HasTimestamps;
use App\Traits\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use HasTimestamps;
    use HasUuids;

    protected $fillable = [
        'path',
        'application_uuid',
    ];

    protected $casts = [
        'path' => 'string',
        'application_uuid' => 'string',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'application_uuid', '_id');
    }

    protected static function booted(): void
    {
        static::retrieved(function (Attachment $attachment) {
            $attachment->path = Storage::disk('public')->url($attachment->path);
        });

        static::deleted(function (Attachment $attachment) {
            if (Storage::exists($attachment->path)) {
                Storage::delete($attachment->path);
            }
        });
    }
}
