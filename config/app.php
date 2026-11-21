<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Nama Aplikasi
    |--------------------------------------------------------------------------
    |
    | Nama aplikasi. Dipakai di notifikasi dan elemen UI yang menampilkan nama app.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Environment Aplikasi
    |--------------------------------------------------------------------------
    |
    | Environment tempat app berjalan (local, production, dst.). Atur lewat `.env`.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Mode Debug
    |--------------------------------------------------------------------------
    |
    | Jika aktif, error menampilkan pesan detail beserta stack trace.
    | Jika nonaktif, hanya halaman error generik.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | URL Aplikasi
    |--------------------------------------------------------------------------
    |
    | Root URL app. Dipakai Artisan untuk membuat URL saat dijalankan dari console.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Timezone Aplikasi
    |--------------------------------------------------------------------------
    |
    | Timezone default untuk fungsi tanggal/waktu PHP. UTC cocok untuk kebanyakan kasus.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Konfigurasi Locale
    |--------------------------------------------------------------------------
    |
    | Locale default untuk fitur translation/localization Laravel.
    | Isi dengan locale yang string terjemahannya tersedia.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | Key untuk layanan enkripsi Laravel. Harus string acak 32 karakter,
    | dan sudah diset sebelum deploy.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', (string) env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Driver Maintenance Mode
    |--------------------------------------------------------------------------
    |
    | Driver untuk status maintenance mode. Driver "cache" memungkinkan
    | status dikontrol lintas beberapa server.
    |
    | Supported drivers: "file", "cache", "array"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
