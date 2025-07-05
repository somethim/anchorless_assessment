<?php

namespace App\Models;

use App\Traits\HasTimestamps;
use App\Traits\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Throwable;

class Application extends Model
{
    use HasTimestamps;
    use HasUuids;

    protected $fillable = [
        'user_uuid',
    ];

    protected $casts = [
        'user_uuid' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_uuid', '_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'application_uuid', '_id');
    }

    protected static function booted(): void
    {
        static::deleted(function (Application $application) {
            if ($application->attachments()->exists()) {
                $application->attachments()->delete();
            }
        });
    }

    /**
     * Store attachments for the application.
     *
     * @param UploadedFile[] $attachments
     *
     * @return void
     */
    public function store_attachments(array $attachments): void
    {
        $disk = Storage::disk('public');
        $dir = 'users/' . $this->user_uuid . '/applications/' . $this->_id;

        foreach ($attachments as $attachment) {
            try {
                $file = $disk->putFile($dir, $attachment);

                $this->attachments()->create([
                    'path' => $file,
                    'original_name' => $attachment->getClientOriginalName(),
                ]);
            } catch (Throwable $th) {
                report($th);
            }
        }
    }
}
