# MOONITOR Landing Page

The public MOONITOR website is built with Laravel 13, Blade, Vite, and the original site's CSS, JavaScript, and image assets. The landing page is static and does not require a database.

## Requirements

- PHP 8.3 or newer
- Composer
- Node.js 20.19 or newer and npm

## Local setup

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
npm install
npm run build
php artisan serve
```

Open `http://127.0.0.1:8000`. Sessions and cache use local files; the queue uses the synchronous driver. No database or migrations are needed to render the website.

For frontend development, run `npm run dev` in a second terminal and keep `php artisan serve` running.

## Verification

```powershell
php artisan optimize:clear
php artisan route:list
php artisan test
npm run build
```

## Railway

Railway can install PHP from the Composer PHP constraint and build the frontend from `package.json`. The included `Procfile` starts Laravel on Railway's injected `PORT`; `/up` is the health-check endpoint.

Set `APP_ENV=production`, `APP_DEBUG=false`, and a generated `APP_KEY` in Railway's service variables. Set `APP_URL` to the deployed HTTPS URL. Do not commit `.env` files or credentials. The app does not require a database for the landing page.

## Scope

The original project remains separate. This project migrates the landing-page views, responsive styling, interactive navigation/about tabs, images, and favicon. The original sensor ingestion and dashboard API are intentionally not included: they persist/read sensor data through SQL and are not needed by this standalone landing page.
