<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Trait that provides custom timestamp handling for Laravel models.
 * Uses camelCase timestamp columns instead of Laravel default snake_case.
 *
 * @property Carbon _createdAt
 * @property Carbon _updatedAt
 * @property Carbon|null _deletedAt
 *
 * @uses SoftDeletes
 */
trait HasTimestamps
{
    use SoftDeletes;

    protected array $dates = ['_deletedAt', '_createdAt', '_updatedAt'];

    /**
     * Initialize the trait
     */
    public function initializeBaseModelTrait(): void
    {
        $this->timestamps = false;

        $this->setCustomDates();
        $this->setCustomCasts();
        $this->guardCustomDates();
    }

    /**
     * Set the custom date columns
     */
    protected function setCustomDates(): void
    {
        $this->dates = array_merge($this->dates ?? [], [
            $this->getCreatedAtColumn(),
            $this->getUpdatedAtColumn(),
            $this->getDeletedAtColumn(),
        ]);
    }

    /**
     * Guard against mass assignment
     */
    protected function guardCustomDates(): void
    {
        $this->guarded = array_merge($this->guarded ?? [], [
            $this->getCreatedAtColumn(),
            $this->getUpdatedAtColumn(),
            $this->getDeletedAtColumn(),
        ]);
    }

    /**
     * Set the custom casts for the model
     */
    protected function setCustomCasts(): void
    {
        $this->casts = array_merge([
            $this->getCreatedAtColumn() => 'datetime',
            $this->getUpdatedAtColumn() => 'datetime',
            $this->getDeletedAtColumn() => 'datetime',
        ], $this->casts ?? []);
    }

    /**
     * Get the name of the "created at" column.
     */
    public function getCreatedAtColumn(): string
    {
        return '_createdAt';
    }

    /**
     * Get the name of the "updated at" column.
     */
    public function getUpdatedAtColumn(): string
    {
        return '_updatedAt';
    }

    /**
     * Get the name of the "deleted at" column.
     */
    public function getDeletedAtColumn(): string
    {
        return '_deletedAt';
    }
}
