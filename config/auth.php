<?php

use App\Models\User;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Autentikasi
    |--------------------------------------------------------------------------
    |
    | Guard dan password reset broker default.
    |
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Guard Autentikasi
    |--------------------------------------------------------------------------
    |
    | Daftar guard. Default memakai session dan provider Eloquent.
    | Setiap guard harus punya user provider yang menentukan dari mana
    | user diambil.
    |
    | Supported: "session"
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Provider
    |--------------------------------------------------------------------------
    |
    | Menentukan cara user diambil dari storage. Tambahkan provider lain
    | jika ada lebih dari satu tabel/model user, lalu pasangkan ke guard.
    |
    | Supported: "database", "eloquent"
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', User::class),
        ],

        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Reset Password
    |--------------------------------------------------------------------------
    |
    | Pengaturan reset password: tabel penyimpanan token dan user provider.
    |
    | `expire`: masa berlaku token (menit).
    | `throttle`: jeda (detik) sebelum user boleh meminta token baru.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Timeout Konfirmasi Password
    |--------------------------------------------------------------------------
    |
    | Durasi (detik) sebelum konfirmasi password kedaluwarsa dan user diminta
    | memasukkan ulang password. Default 3 jam.
    |
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
