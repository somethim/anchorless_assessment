<?php

namespace App\Providers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\ServiceProvider;

class DatabaseMacroServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blueprint::macro('customTimestamps', function () {
            $this->timestamp('_createdAt')->useCurrent();
            $this->timestamp('_updatedAt')->useCurrent()->useCurrentOnUpdate();
            $this->timestamp('_deletedAt')->nullable();
        });
    }
}
