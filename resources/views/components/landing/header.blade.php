<header class="moon-header" id="moon-header">
    <div class="moon-container moon-header__inner">
        <a class="moon-logo" href="{{ route('home') }}" aria-label="MOONITOR — beranda">
            <img src="{{ asset('favicon.png') }}" alt="" aria-hidden="true">
            <span>MOONITOR</span>
        </a>
        <button class="moon-menu-toggle" type="button" aria-label="Buka navigasi" aria-expanded="false" aria-controls="moon-navigation">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <nav class="moon-nav" id="moon-navigation" aria-label="Navigasi utama">
            <a href="#hero">Beranda</a>
            <a href="#features">Fitur</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#teknologi">Cara Kerja</a>
            <a href="#testimonials">Testimoni</a>
            <a href="#faq">FAQ</a>
        </nav>
    </div>
</header>
