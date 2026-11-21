<section class="moon-section moon-technology" id="teknologi" aria-labelledby="technology-title" data-track-section="technology">
    <div class="moon-section-heading">
        <h2 id="technology-title">Teknologi di Balik MOONITOR</h2>
        <p data-adaptive-target="technology-description">Dari kondisi kandang hingga menjadi informasi yang mudah dipahami. Kenali bagaimana MOONITOR membantu proses pemantauan melalui teknologi sensor.</p>
        <template data-adaptive-for="technology-description" data-persona-content="developer">Sensor membaca kondisi kandang, perangkat pengendali memproses datanya, lalu dashboard menampilkan angka, status, dan grafik. Berikut tiap langkah dan komponennya.</template>
    </div>

    <ol class="moon-workflow" aria-label="Empat langkah pemantauan MOONITOR">
        <li class="moon-workflow__item">
            <article class="moon-workflow-card">
                <div class="moon-workflow-card__step">
                    <span class="moon-workflow-card__number">01</span>
                    <span>Langkah 01</span>
                </div>
                <figure class="moon-workflow-card__visual moon-workflow-card__visual--barn" data-skeleton="workflow-barn">
                    <div class="moon-skeleton moon-skeleton--visual" aria-hidden="true"></div>
                    <img src="{{ asset('images/cow-barn.jpg') }}" alt="Ilustrasi lingkungan kandang tempat sensor memantau kondisi udara" loading="lazy">
                    <span class="moon-sensor-marker" aria-hidden="true">
                        <svg viewBox="0 0 32 32"><path d="M13 18V7a3 3 0 0 1 6 0v11a7 7 0 1 1-6 0Z"/><path d="M16 12v12"/></svg>
                    </span>
                    <span class="moon-workflow-card__visual-label">Kondisi kandang</span>
                </figure>
                <h3>Sensor Membaca Kondisi Kandang</h3>
                <p>Sensor mengumpulkan informasi suhu, kelembapan, dan kadar gas di dalam kandang.</p>
            </article>
        </li>

        <li class="moon-workflow__item">
            <article class="moon-workflow-card">
                <div class="moon-workflow-card__step">
                    <span class="moon-workflow-card__number">02</span>
                    <span>Langkah 02</span>
                </div>
                <figure class="moon-workflow-card__visual moon-workflow-card__visual--controller">
                    <svg viewBox="0 0 480 260" role="img" aria-labelledby="controller-title">
                        <title id="controller-title">Ilustrasi konseptual sistem pengendali yang memproses data sensor</title>
                        <path class="moon-controller-wire" d="M70 130h87m166 0h87M116 80v-24m0 148v-24m248-100v-24m0 148v-24"/>
                        <rect class="moon-controller-node" x="30" y="106" width="40" height="48" rx="8"/>
                        <rect class="moon-controller-node" x="410" y="106" width="40" height="48" rx="8"/>
                        <rect class="moon-controller-node" x="92" y="36" width="48" height="40" rx="8"/>
                        <rect class="moon-controller-node" x="340" y="36" width="48" height="40" rx="8"/>
                        <rect class="moon-controller-node" x="92" y="184" width="48" height="40" rx="8"/>
                        <rect class="moon-controller-node" x="340" y="184" width="48" height="40" rx="8"/>
                        <rect class="moon-controller-board" x="157" y="62" width="166" height="136" rx="16"/>
                        <rect class="moon-controller-chip" x="190" y="91" width="100" height="78" rx="10"/>
                        <path class="moon-controller-trace" d="M207 80v11m22-11v11m22-11v11m22-11v11m-66 78v11m22-11v11m22-11v11m22-11v11m-70-87h-17m17 20h-17m17 20h-17m117-40h17m-17 20h17m-17 20h17"/>
                        <circle class="moon-controller-light" cx="211" cy="111" r="5"/>
                        <circle class="moon-controller-light" cx="228" cy="111" r="5"/>
                        <path class="moon-controller-signal" d="M244 139v-11l10-10 10 10v11m-13 0h6m-3-7v14"/>
                    </svg>
                    <span class="moon-workflow-card__visual-label">Ilustrasi sistem</span>
                </figure>
                <h3>Data Diproses oleh Sistem</h3>
                <p>Informasi dari sensor diterima dan diproses oleh perangkat pengendali sebelum ditampilkan.</p>
            </article>
        </li>

        <li class="moon-workflow__item">
            <article class="moon-workflow-card">
                <div class="moon-workflow-card__step">
                    <span class="moon-workflow-card__number">03</span>
                    <span>Langkah 03</span>
                </div>
                <figure class="moon-workflow-card__visual moon-dashboard-illustration">
                    <div class="moon-dashboard-illustration__topbar">
                        <span class="moon-dashboard-illustration__brand"><i aria-hidden="true"></i> MOONITOR</span>
                        <span>Ringkasan kondisi</span>
                    </div>
                    <div class="moon-dashboard-illustration__metrics" aria-hidden="true">
                        <span><small>Suhu</small><strong>°C</strong></span>
                        <span><small>Kelembapan</small><strong>%</strong></span>
                        <span><small>Amonia</small><strong>ppm</strong></span>
                        <span><small>H₂S</small><strong>ppm</strong></span>
                    </div>
                    <div class="moon-dashboard-illustration__chart" aria-hidden="true">
                        <span>Grafik pemantauan</span>
                        <svg viewBox="0 0 320 88" preserveAspectRatio="none">
                            <path class="moon-dashboard-illustration__grid" d="M0 18h320M0 44h320M0 70h320"/>
                            <polyline class="moon-dashboard-illustration__line moon-dashboard-illustration__line--green" points="0,59 40,51 78,55 116,34 154,44 194,29 232,36 274,20 320,27"/>
                            <polyline class="moon-dashboard-illustration__line moon-dashboard-illustration__line--blue" points="0,28 40,35 78,25 116,38 154,30 194,41 232,24 274,33 320,18"/>
                        </svg>
                    </div>
                    <span class="moon-workflow-card__visual-label">Ilustrasi dashboard</span>
                </figure>
                <h3>Informasi Ditampilkan di Dashboard</h3>
                <p>Data ditampilkan dalam bentuk angka, status, dan grafik yang mudah dibaca.</p>
            </article>
        </li>

        <li class="moon-workflow__item">
            <article class="moon-workflow-card">
                <div class="moon-workflow-card__step">
                    <span class="moon-workflow-card__number">04</span>
                    <span>Langkah 04</span>
                </div>
                <figure class="moon-workflow-card__visual moon-workflow-card__visual--farmer">
                    <svg viewBox="0 0 480 260" role="img" aria-labelledby="farmer-title">
                        <title id="farmer-title">Ilustrasi peternak melihat informasi kandang melalui laptop</title>
                        <path class="moon-farmer-window" d="M44 48h392v164H44z"/>
                        <path class="moon-farmer-sky" d="M45 49h390v108H45z"/>
                        <path class="moon-farmer-horizon" d="M45 144c55-30 98-18 144-4 54 16 101-26 148-19 35 5 64 25 98 11v26H45z"/>
                        <path class="moon-farmer-horizon moon-farmer-horizon--dark" d="M45 163c58-19 103-4 150 7 51 12 103-16 149-12 33 3 59 20 91 10v18H45z"/>
                        <path class="moon-farmer-ground" d="M45 182h390v29H45z"/>
                        <path class="moon-farmer-person" d="M133 210c2-37 14-58 43-65l29 17 29-17c29 7 42 28 44 65"/>
                        <path class="moon-farmer-shirt" d="M175 149c7 12 16 18 30 18s24-6 31-18l20 9 10 52H145l10-52z"/>
                        <circle class="moon-farmer-face" cx="205" cy="108" r="28"/>
                        <path class="moon-farmer-hat" d="M171 103c2-25 16-39 36-39s34 14 36 39h-72z"/>
                        <path class="moon-farmer-hat-brim" d="M166 104h82"/>
                        <path class="moon-farmer-laptop" d="M272 152h117v68H272z"/>
                        <path class="moon-farmer-screen" d="M280 160h101v50H280z"/>
                        <path class="moon-farmer-laptop-base" d="M263 220h136l-10 9H273z"/>
                        <path class="moon-farmer-screen-line" d="M290 174h28m-28 9h43m-43 9h32"/>
                        <circle class="moon-farmer-screen-dot" cx="367" cy="174" r="5"/>
                    </svg>
                    <span class="moon-workflow-card__visual-label">Pemantauan oleh peternak</span>
                </figure>
                <h3>Peternak Memantau Kondisi</h3>
                <p>Peternak dapat melihat kondisi kandang dan memperhatikan perubahan yang terjadi.</p>
            </article>
        </li>
    </ol>

    <div class="moon-technology__cards" aria-label="Komponen utama MOONITOR">
        <article class="moon-technology-card" data-persona-highlight="developer">
            <span class="moon-technology-card__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><path d="M13 18V7a3 3 0 0 1 6 0v11a7 7 0 1 1-6 0Z"/><path d="M16 12v12"/></svg>
            </span>
            <div>
                <h3>Sensor</h3>
                <p>Perangkat yang membaca kondisi lingkungan kandang seperti suhu, kelembapan, dan kadar gas.</p>
            </div>
        </article>
        <article class="moon-technology-card" data-persona-highlight="developer">
            <span class="moon-technology-card__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" rx="3"/><path d="M12 3v5m8-5v5m-8 16v5m8-5v5M3 12h5m-5 8h5m16-8h5m-5 8h5M13 13h6v6h-6z"/></svg>
            </span>
            <div>
                <h3>Perangkat Pengendali</h3>
                <p>Bagian sistem yang menerima dan memproses informasi dari sensor.</p>
            </div>
        </article>
        <article class="moon-technology-card">
            <span class="moon-technology-card__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="18" rx="2"/><path d="M10 28h12m-6-5v5m-9-13 5-5 4 4 6-7m0 0v5m0-5h-5"/></svg>
            </span>
            <div>
                <h3>Dashboard</h3>
                <p>Tempat peternak melihat hasil pemantauan dalam bentuk informasi yang mudah dipahami.</p>
            </div>
        </article>
    </div>
</section>
