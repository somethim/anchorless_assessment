<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('_id')->primary();
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->customTimestamps();
            $table->timestamp('_verifiedAt')->nullable();
        });

        Schema::create('session_audits', function (Blueprint $table) {
            $table->uuid('_id')->primary();
            $table->customTimestamps();
            $table->foreignUuid('user_uuid')->index()->constrained('users', '_id')->cascadeOnDelete();
            $table->string('session_id', 1024)->nullable();
            $table->string('session_id_hash')->index()->nullable();
            $table->string('user_agent', 1024)->nullable();

            $table->string('ip_address', 1024)->nullable();
            $table->string('platform', 1024)->nullable(); // device, OS
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('session_audits');
        Schema::dropIfExists('password_reset_tokens');
    }
};
