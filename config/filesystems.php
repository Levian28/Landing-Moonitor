<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Disk Filesystem Default
    |--------------------------------------------------------------------------
    |
    | Disk default untuk penyimpanan file.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Disk Filesystem
    |--------------------------------------------------------------------------
    |
    | Daftar disk. Satu driver boleh dipakai di beberapa disk.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Link
    |--------------------------------------------------------------------------
    |
    | Symlink yang dibuat oleh `storage:link`. Key adalah lokasi link,
    | value adalah target.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
