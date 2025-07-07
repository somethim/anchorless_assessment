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
3. Change directory to the Docker setup:
   ```sh
   cd docker
   ```
4. Start the backend services (ensure required ports are free):
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
3. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```

