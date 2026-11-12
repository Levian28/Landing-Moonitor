<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="MOONITOR membantu peternak memahami kondisi kandang sapi melalui informasi suhu, kelembapan, dan kualitas udara.">
    <meta name="theme-color" content="#080022">
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Oxanium:wght@500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <title>@yield('title', 'MOONITOR — Cerdas Pantau Sapi')</title>
</head>
<body class="moon-landing">
    <a class="moon-skip" href="#main">Lewati ke konten</a>
    @include('components.landing.header')
    <main id="main">
        @yield('content')
        </main>
        @include('components.landing.footer')
</body>
</html>
