/**
 * Animasi masuk berbasis scroll + penanda keadaan section untuk lapisan ambient.
 *
 * - Elemen target diberi class `moon-reveal` dari sini (bukan di markup), jadi tanpa
 *   JS / IntersectionObserver semua konten tetap terlihat.
 * - Setiap elemen hanya dianimasikan sekali (observer dilepas setelah tampil).
 * - Elemen yang muncul bersamaan diberi jeda bertahap (stagger) sesuai urutannya.
 * - prefers-reduced-motion: tidak ada elemen yang disembunyikan atau dianimasikan.
 */

const STAGGER_MS = 100;
const MAX_STAGGER_STEPS = 5;

// Urutan penting: elemen yang cocok lebih dulu tidak didaftarkan ulang oleh aturan berikutnya.
// delay: jeda dasar (ms); stagger: ikut jeda bertahap bersama elemen lain yang tampil serentak.
const REVEAL_TARGETS = [
    { selector: '.moon-section-heading .moon-eyebrow, .moon-section-heading h2, .moon-testimonials__intro .moon-eyebrow, .moon-testimonials__intro h2', delay: 0 },
    { selector: '.moon-section-heading p:not(.moon-eyebrow), .moon-testimonials__intro p', delay: 120 },
    { selector: '.moon-promo, .moon-dashboard-preview, .moon-final-cta', delay: 0 },
    { selector: '.moon-feature-card, .moon-workflow__item, .moon-technology-card, .moon-faq-item, .moon-about-panel, .moon-about-links', delay: 0, stagger: true },
    // Di mobile kartu berada di scroller horizontal (sebagian di luar viewport), jadi pemicunya wadahnya.
    { selector: '.moon-testimonial-card', delay: 0, stagger: true, via: '.moon-testimonials__stack' },
    { selector: '.moon-testimonials__topics, .moon-testimonials__summary', delay: 0 },
];

const SECTION_SELECTOR = '.moon-hero, main section[id]';

function registerTargets() {
    const seen = new Set();
    for (const { selector, delay, stagger, via } of REVEAL_TARGETS) {
        document.querySelectorAll(selector).forEach((el) => {
            if (seen.has(el) || el.classList.contains('moon-reveal')) return;
            seen.add(el);
            el.classList.add('moon-reveal');
            el.dataset.revealDelay = String(delay);
            if (stagger) el.dataset.revealStagger = '';
            if (via) el.dataset.revealVia = via;
        });
    }
}

function observeSections(signal) {
    const sections = document.querySelectorAll(SECTION_SELECTOR);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add('is-in-view', 'is-on-screen');
            } else {
                el.classList.remove('is-on-screen');
                // Section yang sudah terlewati (mis. refresh di tengah halaman) tetap dianggap terlihat
                if (entry.boundingClientRect.top < 0) el.classList.add('is-in-view');
            }
        });
    }, { rootMargin: '0px 0px -12% 0px' });

    sections.forEach((el) => observer.observe(el));
    signal?.addEventListener('abort', () => observer.disconnect(), { once: true });
}

function observeReveals(signal) {
    const pending = Array.from(document.querySelectorAll('.moon-reveal:not(.is-revealed)'));
    if (!pending.length) return;

    // Pemicu = elemen itu sendiri, atau wadah (data-reveal-via) bila elemen bisa berada di luar viewport.
    const groups = new Map();
    pending.forEach((el) => {
        const trigger = (el.dataset.revealVia && el.closest(el.dataset.revealVia)) || el;
        if (!groups.has(trigger)) groups.set(trigger, []);
        groups.get(trigger).push(el);
    });

    const observer = new IntersectionObserver((entries, self) => {
        let step = 0;
        entries
            .filter((entry) => entry.isIntersecting || entry.boundingClientRect.top < 0)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
            .forEach((entry) => {
                self.unobserve(entry.target);
                (groups.get(entry.target) || []).forEach((el) => {
                    let delay = Number(el.dataset.revealDelay) || 0;
                    if ('revealStagger' in el.dataset) {
                        delay += Math.min(step, MAX_STAGGER_STEPS) * STAGGER_MS;
                        step += 1;
                    }
                    el.style.setProperty('--reveal-delay', `ms`);
                    el.classList.add('is-revealed');
                });
            });
    }, { rootMargin: '0px 0px -10% 0px' });

    groups.forEach((_, trigger) => observer.observe(trigger));
    signal?.addEventListener('abort', () => observer.disconnect(), { once: true });
}
export function initializeReveal({ signal } = {}) {
    const supported = typeof IntersectionObserver !== 'undefined';
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!supported || reduced) {
        // Tanpa animasi: tampilkan lapisan ambient secara statis dan jangan sembunyikan apa pun.
        document.querySelectorAll(SECTION_SELECTOR).forEach((el) => el.classList.add('is-in-view'));
        return;
    }

    registerTargets();
    observeReveals(signal);
    observeSections(signal);
}
