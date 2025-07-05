<?php

namespace App\Traits;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Trait that provides UUID generation for models using the `_id` column.
 */
trait HasUuids
{
    /**
     * Boot the trait and attach the UUID generation logic.
     *
     * @throws Exception
     * @return void
     */
    public static function bootHasUuids(): void
    {
        static::creating(function (Model $model) {
            if (empty($model->_id)) {
                $model->_id = Str::uuid()->toString();
            }
        });
    }

    /**
     * Get the key type for the model.
     *
     * @return string
     */
    public function getKeyType(): string
    {
        return 'string';
    }

    /**
     * Determine if the IDs are incrementing.
     *
     * @return bool
     */
    public function getIncrementing(): bool
    {
        return false;
    }

    /**
     * Get the primary key for the model.
     *
     * @return string
     */
    public function getKeyName(): string
    {
        return '_id';
    }
}
