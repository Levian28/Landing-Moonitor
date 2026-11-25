<section class="moon-section moon-dashboard" id="dashboard" aria-labelledby="dashboard-title" data-track-section="dashboard">
    <span class="moon-anchor-alias" id="riwayat" aria-hidden="true"></span>
    <div class="moon-section-heading">
        <h2 id="dashboard-title">Pantau Semua dari Satu Tempat</h2>
        <p>Lihat bagaimana informasi kondisi kandang ditampilkan melalui dashboard MOONITOR.</p>
    </div>
    <figure class="moon-dashboard-preview" data-skeleton="dashboard-preview">
        <div class="moon-skeleton moon-skeleton--dashboard" aria-hidden="true">
            <div class="moon-skeleton-dashboard__topbar">
                <span class="moon-skeleton__pill"></span>
                <span class="moon-skeleton__pill moon-skeleton__pill--sm"></span>
            </div>
            <div class="moon-skeleton-dashboard__grid">
                <div class="moon-skeleton__tile"></div>
                <div class="moon-skeleton__tile"></div>
                <div class="moon-skeleton__tile"></div>
                <div class="moon-skeleton__tile"></div>
            </div>
            <div class="moon-skeleton-dashboard__chart"></div>
        </div>
        <button class="moon-dashboard-preview__open" type="button" data-preview-open aria-haspopup="dialog" aria-controls="imageModal">
            <img
                id="previewImg"
                src="{{ asset('images/dashobard-dummy.png') }}"
                alt="Pratinjau dashboard MOONITOR dengan suhu, kelembapan, kadar amonia dan hidrogen sulfida, status kandang, grafik kondisi, serta tampilan kandang langsung"
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
            >
            <span class="moon-dashboard-preview__hint" aria-hidden="true">Ketuk untuk memperbesar</span>
        </button>
    </figure>
</section>

<dialog id="imageModal" class="moon-dialog" aria-label="Pratinjau dashboard diperbesar">
    <button id="closeModal" class="moon-dialog__close" type="button" aria-label="Tutup pratinjau">&times;</button>
    <div class="moon-dialog__scroll" data-skeleton="modal-preview">
        <div class="moon-skeleton moon-skeleton--modal" aria-hidden="true"></div>
        <img id="modalImage" src="" alt="">
    </div>
</dialog>
