<footer class="moon-footer">
    <div class="moon-container moon-footer__main">
        <div class="moon-footer__brand">
            <a class="moon-logo" href="{{ route('home') }}" aria-label="MOONITOR — kembali ke atas">
                <img src="{{ asset('favicon.png') }}" alt="" aria-hidden="true">
                <span>MOONITOR</span>
            </a>
            <p>MOONITOR membantu peternak mengetahui kondisi kandang sapi dalam satu platform.</p>
        </div>
        <div class="moon-footer__links">
            <div>
                <strong>Produk</strong>
                <a href="#dashboard">Dashboard</a>
                <a href="#artikel">Artikel</a>
                <a href="#riwayat">Riwayat</a>
            </div>
            <div>
                <strong>Perusahaan</strong>
                <a href="#tentang">Tentang Kami</a>
                <a href="#umum">Kontak</a>
                <a href="#faq">FAQ</a>
            </div>
        </div>
    </div>
    <div class="moon-container moon-footer__bottom">
        <span>© {{ now()->year }} MOONITOR. Hak cipta dilindungi.</span>
        <a href="#main">Kembali ke atas ↑</a>
    </div>
</footer>
