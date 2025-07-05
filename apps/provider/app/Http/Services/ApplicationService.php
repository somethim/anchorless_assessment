<?php

namespace App\Http\Services;

use App\Models\Application;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Throwable;

class ApplicationService
{
    public function index(string $_id): array
    {
        return Application::with('attachments')->where('user_uuid', $_id)->get()->toArray();
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

    public function show(string $current_user): Application
    {
        return Application::with('attachments')->where('user_uuid', $current_user)->firstOrFail();
    }

    /**
     * @throws Throwable
     */
    public function update(string $application, string $user_uuid, array $newAttachments, array $remove = []): Application
    {
        $application = DB::transaction(function () use ($application, $user_uuid, $newAttachments, $remove) {
            $application = Application::findOrFail($application);
            $application->updateOrFail(['user_uuid' => $user_uuid]);

            if (!empty($remove)) {
                $application->attachments()->whereIn('_id', $remove)->delete();
            }

            return $application;
        });
        $application->store_attachments($newAttachments);

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
