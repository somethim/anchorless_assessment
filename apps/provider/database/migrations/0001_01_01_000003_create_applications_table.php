<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->uuid('_id')->primary();
            $table->foreignUuid('user_uuid')->index()->constrained('users', '_id')->cascadeOnDelete();
            $table->customTimestamps();
        });

        Schema::create('attachments', function (Blueprint $table) {
            $table->uuid('_id')->primary();
            $table->string('path')->unique();
            $table->foreignUuid('application_uuid')->index()->constrained('applications', '_id')->cascadeOnDelete();
            $table->customTimestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
