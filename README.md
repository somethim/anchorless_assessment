# Project Setup Instructions

## Backend

1. Change directory to the backend provider:
   ```sh
   cd apps/provider
   ```
2. Install PHP dependencies:
   ```sh
   composer install
   ```
3. Set up `.env`
 ```
   # App Config
   APP_NAME=AnchorLess
   APP_ENV=local
   APP_KEY=
   APP_DEBUG=true
   APP_URL=http://localhost:8000
   WEB_URL=http://localhost:3000
   APP_TIMEZONE=UTC
   BCRYPT_ROUNDS=12

   # Database
   DB_CONNECTION=pgsql
   DB_HOST=anchorless_postgres
   DB_PORT=5432
   DB_DATABASE=anchorless_postgres
   DB_USERNAME=anchorless_postgres
   DB_PASSWORD=anchorless_postgres

   # Redis Configuration
   REDIS_CLIENT=phpredis
   REDIS_HOST=anchorless_redis
   REDIS_PORT=6379
   REDIS_PASSWORD=null
   REDIS_READ_WRITE_TIMEOUT=-1

   # Cache Configuration
   CACHE_DRIVER=redis
   CACHE_STORE=redis
   CACHE_PREFIX=

   # Queue Configuration
   QUEUE_CONNECTION=redis
   REDIS_QUEUE_CONNECTION=queue

   # Filesystem Configuration
   FILESYSTEM_DISK=local
   MAX_FILE_SIZE=51200

   # Session Configuration
   SESSION_DRIVER=redis
   SESSION_LIFETIME=10080
   SESSION_ENCRYPT=false
   SESSION_PATH=/
   SESSION_DOMAIN=localhost
   SESSION_SECURE_COOKIE=false

   # Logging
   LOG_CHANNEL=stderr
   LOG_STACK=single
   LOG_DEPRECATIONS_CHANNEL=null
   LOG_LEVEL=debug
   ```
   
4. Change directory to the Docker setup:
   ```sh
   cd docker
   ```
5. Start the backend services (ensure required ports are free):
   ```sh
   docker compose up --build
   ```

## Frontend

1. Change directory to the frontend app:
   ```sh
   cd apps/web
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   bun install
   ```
3. Set up `.env`
   ```
   VITE_PROVIDER_URL="http://localhost:8000"
   ```
5. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```

