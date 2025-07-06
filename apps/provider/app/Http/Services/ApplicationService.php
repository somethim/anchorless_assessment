<?php

namespace App\Http\Services;

use App\Enums\AttachmentType;
use App\Models\Application;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Throwable;

class ApplicationService
{
    public function index(string $_id): array
    {
        return Application::where('user_uuid', $_id)->orderBy('_createdAt', 'desc')->get()->toArray();
    }

    /**
     * @param string $user_uuid
     * @param UploadedFile[] $attachments
     *
     * @return Application
     */
    public function store(string $user_uuid, array $attachments): Application
    {
        $application = Application::create(['user_uuid' => $user_uuid]);

        $application->store_attachments($attachments);

        return $application->load('attachments');
    }

    public function show(string $application): Application
    {
        return Application::with(['attachments' => function ($query) {
            $query->orderByRaw(AttachmentType::getOrderClause());
        }])->findOrFail($application);

    }

    /**
     * @throws Throwable
     */
    public function update(string $application, string $user_uuid, ?array $newAttachments = [], ?array $remove = []): Application
    {
        $application = DB::transaction(function () use ($application, $user_uuid, $newAttachments, $remove) {
            $application = Application::findOrFail($application);
            if ($application->user_uuid !== $user_uuid) {
                throw new Exception('Unauthorized action.');
            }

            if (!empty($remove)) {
                $application->attachments()->whereIn('_id', $remove)->delete();
            }

            return $application;
        });
        if (!empty($newAttachments)) {
            $application->store_attachments($newAttachments);
        }

        return $application->load('attachments');
    }

    /**
     * @throws Throwable
     */
    public function destroy(string $application): void
    {
        DB::transaction(function () use ($application) {
            $application = Application::findOrFail($application);
            $application->attachments()->delete();
            $application->deleteOrFail();
        });
    }
}
