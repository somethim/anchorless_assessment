#!/bin/sh

# Check for .env.local files and set the active one
if [ -f .env.local.local ]; then
    echo "Using .env.local file..."
    ENV_FILE=".env.local"
    cp .env.local .env
elif [ -f .env.local ]; then
    echo "Using .env file..."
    ENV_FILE=".env"
else
    echo "Error: Neither .env nor .env.local file found. Please create one before starting the container."
    exit 1
fi

# 1. Install dependencies first
echo "Installing dependencies..."
if [ "$APP_ENV" = "local" ]; then
    composer install --no-scripts --no-interaction --optimize-autoloader
else
    composer install --no-dev --no-scripts --no-interaction --optimize-autoloader
fi

# 2. Generate and load key if needed (before any other Laravel commands)
if [ -z "$APP_KEY" ] || ! grep -q '^APP_KEY=[^[:space:]]\+' "$ENV_FILE" || grep -q '^APP_KEY=$' "$ENV_FILE"; then
    echo "No valid application key found in $ENV_FILE, generating key..."
    php artisan key:generate
fi

# 3. Run migrations
if ! php artisan migrate:status; then
    echo "No migrations found, running migrations..."
    php artisan migrate
else
    echo "Migrations already exist, skipping migrations..."
fi

# 4. Now run autoload and post-install tasks
echo "Running post-install tasks..."
composer dump-autoload -o
php artisan optimize
php artisan package:discover --ansi

# 5. Clear and recache with error handling
echo "Clearing and recaching..."
if ! php artisan optimize:clear; then
    echo "Error during cache clearing"
    exit 1
fi

if ! php artisan optimize; then
    echo "Error during cache regeneration"
    exit 1
fi

# Create storage link if it doesn't exist
if [ ! -L public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link
fi

exec "$@"
