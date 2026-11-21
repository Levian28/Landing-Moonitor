<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Session Driver Default
    |--------------------------------------------------------------------------
    |
    | Driver penyimpanan session.
    |
    | Supported: "file", "cookie", "database", "memcached",
    |            "redis", "dynamodb", "array"
    |
    */

    'driver' => env('SESSION_DRIVER', 'file'),

    /*
    |--------------------------------------------------------------------------
    | Lifetime Session
    |--------------------------------------------------------------------------
    |
    | Lama (menit) session boleh idle sebelum kedaluwarsa.
    | Gunakan `expire_on_close` agar session berakhir saat browser ditutup.
    |
    */

    'lifetime' => (int) env('SESSION_LIFETIME', 120),

    'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),

    /*
    |--------------------------------------------------------------------------
    | Enkripsi Session
    |--------------------------------------------------------------------------
    |
    | Enkripsi data session sebelum disimpan. Berjalan otomatis.
    |
    */

    'encrypt' => env('SESSION_ENCRYPT', false),

    /*
    |--------------------------------------------------------------------------
    | Lokasi File Session
    |--------------------------------------------------------------------------
    |
    | Lokasi file session untuk driver "file".
    |
    */

    'files' => storage_path('framework/sessions'),

    /*
    |--------------------------------------------------------------------------
    | Koneksi Database Session
    |--------------------------------------------------------------------------
    |
    | Koneksi untuk driver "database" atau "redis". Harus cocok dengan
    | salah satu koneksi di config database.
    |
    */

    'connection' => env('SESSION_CONNECTION'),

    /*
    |--------------------------------------------------------------------------
    | Tabel Database Session
    |--------------------------------------------------------------------------
    |
    | Tabel untuk driver "database".
    |
    */

    'table' => env('SESSION_TABLE', 'sessions'),

    /*
    |--------------------------------------------------------------------------
    | Cache Store Session
    |--------------------------------------------------------------------------
    |
    | Cache store untuk session berbasis cache. Harus cocok dengan salah
    | satu store di config cache.
    |
    | Affects: "dynamodb", "memcached", "redis"
    |
    */

    'store' => env('SESSION_STORE'),

    /*
    |--------------------------------------------------------------------------
    | Lottery Pembersihan Session
    |--------------------------------------------------------------------------
    |
    | Peluang pembersihan session lama pada sebuah request, untuk driver
    | yang membersihkan storage secara manual. Default 2 dari 100.
    |
    */

    'lottery' => [2, 100],

    /*
    |--------------------------------------------------------------------------
    | Nama Cookie Session
    |--------------------------------------------------------------------------
    |
    | Nama cookie session. Umumnya tidak perlu diubah.
    |
    */

    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug((string) env('APP_NAME', 'laravel')).'-session'
    ),

    /*
    |--------------------------------------------------------------------------
    | Path Cookie Session
    |--------------------------------------------------------------------------
    |
    | Path tempat cookie berlaku. Umumnya root aplikasi.
    |
    */

    'path' => env('SESSION_PATH', '/'),

    /*
    |--------------------------------------------------------------------------
    | Domain Cookie Session
    |--------------------------------------------------------------------------
    |
    | Domain dan subdomain yang dapat mengakses cookie. Default: root domain
    | tanpa subdomain.
    |
    */

    'domain' => env('SESSION_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Cookie Khusus HTTPS
    |--------------------------------------------------------------------------
    |
    | Jika true, cookie hanya dikirim lewat koneksi HTTPS.
    |
    */

    'secure' => env('SESSION_SECURE_COOKIE'),

    /*
    |--------------------------------------------------------------------------
    | Akses HTTP Only
    |--------------------------------------------------------------------------
    |
    | Jika true, cookie tidak bisa diakses JavaScript. Sebaiknya tetap aktif.
    |
    */

    'http_only' => env('SESSION_HTTP_ONLY', true),

    /*
    |--------------------------------------------------------------------------
    | Cookie Same-Site
    |--------------------------------------------------------------------------
    |
    | Perilaku cookie pada request cross-site, untuk mitigasi CSRF.
    | Default "lax" agar request cross-site yang aman tetap diizinkan.
    |
    | Lihat: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
    |
    | Supported: "lax", "strict", "none", null
    |
    */

    'same_site' => env('SESSION_SAME_SITE', 'lax'),

    /*
    |--------------------------------------------------------------------------
    | Partitioned Cookies
    |--------------------------------------------------------------------------
    |
    | Mengikat cookie ke top-level site pada konteks cross-site. Browser
    | hanya menerimanya jika "secure" aktif dan Same-Site bernilai "none".
    |
    */

    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),

    /*
    |--------------------------------------------------------------------------
    | Serialization Session
    |--------------------------------------------------------------------------
    |
    | Strategi serialization data session. Default JSON. Nilai "php" mengizinkan
    | objek PHP di session, tetapi rentan gadget chain attack jika APP_KEY bocor.
    |
    | Supported: "json", "php"
    |
    */

    'serialization' => 'json',

];
