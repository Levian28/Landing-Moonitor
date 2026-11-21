import { SECTION_IDS } from './constants.js';
import { buildFeatures } from './features.js';
import { getRuntime } from './state.js';
import { scheduleEvaluation } from './engine.js';

export const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export const debugLog = (...args) => {
    const rt = getRuntime();
    if (rt?.cfg.debug) console.debug('[moonitor-adaptive]', ...args);
};

export function createSignals(now) {
    return {
        startedAt: now,
        lastTick: now,
        visible: true,
        idle: false,
        lastActivityAt: now,
        visibleMs: 0,
        idleMs: 0,
        dwellMs: Object.fromEntries(SECTION_IDS.map((id) => [id, 0])),
        active: null,         // ID section dengan eksposur viewport terbesar
        visibleH: {},         // Tinggi terlihat tiap section dalam px
        seen: new Set(),
        scroll: { samples: 0, sumSpeed: 0, fast: 0, back: 0, lastY: 0, lastT: now, upRun: 0, lastDir: 0 },
        counts: { selection: 0, faqOpen: 0, aboutTech: 0, aboutBenefit: 0, navTech: 0, navBenefit: 0, navTrust: 0, ctaContact: 0, previewOpen: 0 },
    };
}

/** Akumulasikan elapsed time ke penghitung dwell / visible / idle */
export function flushDwell(t = nowMs()) {
    const rt = getRuntime();
    if (!rt) return;
    const s = rt.signals;
    const dt = t - s.lastTick;
    s.lastTick = t;
    if (dt <= 0) return;
    if (s.visible) {
        s.visibleMs += dt;
        if (s.idle) s.idleMs += dt;
        else if (s.active) s.dwellMs[s.active] += dt;
    }
}

/** Catat interaksi user dan reset timer idle */
export function markActivity() {
    const rt = getRuntime();
    if (!rt) return;
    const s = rt.signals;
    const t = nowMs();
    if (!s.idle && t - s.lastActivityAt < 200) return; // Throttle event aktivitas yang terlalu rapat
    s.lastActivityAt = t;
    if (s.idle) {
        flushDwell(t);
        s.idle = false;
        armIdleTimer();
        scheduleEvaluation();
    }
}

export function armIdleTimer() {
    const rt = getRuntime();
    if (!rt || rt.timers.idle) return;
    const check = () => {
        const cur = getRuntime();
        if (!cur) return;
        cur.timers.idle = null;
        const remaining = cur.signals.lastActivityAt + cur.cfg.idleAfterMs - nowMs();
        if (remaining > 0) {
            cur.timers.idle = setTimeout(check, remaining);
            return;
        }
        flushDwell();
        cur.signals.idle = true;
    };
    rt.timers.idle = setTimeout(check, rt.cfg.idleAfterMs);
}

/** Pelacakan kecepatan scroll, rasio skimming, dan scroll balik terarah */
export function trackScrollVelocity() {
    const rt = getRuntime();
    if (!rt) return;
    const { signal } = rt.controller;
    const s = rt.signals;
    s.scroll.lastY = window.scrollY;
    s.scroll.lastT = nowMs();
    let queued = false;

    const sample = () => {
        queued = false;
        const t = nowMs();
        const y = window.scrollY;
        const sc = s.scroll;
        const dt = t - sc.lastT;
        if (rt.programmaticScrollUntil > t) { sc.lastY = y; sc.lastT = t; return; } // Abaikan scroll animasi dari link anchor
        if (dt < rt.cfg.scrollSampleMs) return;                                       // Throttle interval sampling
        const dy = y - sc.lastY;
        sc.lastY = y;
        sc.lastT = t;
        if (dy === 0) return;

        const speed = (Math.abs(dy) / dt) * 1000;
        sc.samples += 1;
        sc.sumSpeed += speed;
        if (speed > rt.cfg.fastScrollPxPerSec) sc.fast += 1;

        const dir = dy > 0 ? 1 : -1;
        if (dir < 0) sc.upRun += -dy;
        else {
            if (sc.upRun >= rt.cfg.scrollBackMinPx) sc.back += 1; // Terdeteksi scroll balik ke atas yang cukup signifikan
            sc.upRun = 0;
        }
        sc.lastDir = dir;
    };

    window.addEventListener('scroll', () => {
        markActivity();
        if (queued) return;
        queued = true;
        requestAnimationFrame(sample);
    }, { passive: true, signal });

    // Reset proteksi scroll terprogram saat navigasi smooth-scroll selesai
    window.addEventListener('scrollend', () => {
        const cur = getRuntime();
        if (cur) cur.programmaticScrollUntil = 0;
    }, { passive: true, signal });
}

/**
 * Memantau section aktif berdasarkan porsi area viewport terbesar.
 * Section dihitung aktif jika menempati minimal 25% tinggi layar.
 */
export function observeSectionDwellTime() {
    if (typeof IntersectionObserver === 'undefined') return;
    const rt = getRuntime();
    if (!rt) return;
    const s = rt.signals;
    const sections = Array.from(document.querySelectorAll('[data-track-section]'));
    if (!sections.length) return;

    rt.observers.dwell = new IntersectionObserver((entries) => {
        flushDwell(); // Tutup akumulasi durasi pada section sebelumnya
        for (const entry of entries) {
            const id = entry.target.dataset.trackSection;
            if (SECTION_IDS.includes(id)) s.visibleH[id] = entry.isIntersecting ? entry.intersectionRect.height : 0;
        }
        let best = null;
        let bestH = 0;
        for (const [id, h] of Object.entries(s.visibleH)) {
            if (h > bestH) { best = id; bestH = h; }
        }
        s.active = bestH >= window.innerHeight * 0.25 ? best : null;
        if (s.active) s.seen.add(s.active);
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    sections.forEach((el) => rt.observers.dwell.observe(el));
}

/** Tracking interaksi pasif: klik elemen kunci, ekspansi FAQ, dan seleksi teks */
export function detectUserInteractions() {
    const rt = getRuntime();
    if (!rt) return;
    const { signal } = rt.controller;
    const c = rt.signals.counts;
    const cfg = rt.cfg;

    document.addEventListener('click', (event) => {
        markActivity();
        const el = event.target instanceof Element ? event.target : null;
        if (!el) return;

        const cta = el.closest('[data-track-cta]');
        if (cta?.dataset.trackCta === 'contact') { c.ctaContact += 1; return; }

        const anchor = el.closest('a[href^="#"]');
        if (anchor) {
            const cur = getRuntime();
            if (cur) cur.programmaticScrollUntil = nowMs() + 1500; // Penanda scroll terprogram agar tidak dihitung sebagai kecepatan membaca
            const id = anchor.getAttribute('href').slice(1);
            const counter = cfg.navAffinity[id] ?? (cta?.dataset.trackCta === 'how-it-works' ? 'navTech' : null);
            if (counter) c[counter] += 1;
        }

        const tab = el.closest('[data-about-tab]');
        if (tab) {
            const key = tab.dataset.aboutTab;
            if (key === 'cara-kerja') c.aboutTech += 1;
            else if (key === 'manfaat' || key === 'tujuan') c.aboutBenefit += 1;
        }
        if (el.closest('[data-preview-open]')) c.previewOpen += 1;
    }, { signal });

    // Event toggle <details> tidak bubbling; dengarkan di fase capture
    document.addEventListener('toggle', (event) => {
        const el = event.target;
        if (el instanceof HTMLDetailsElement && el.open && el.classList.contains('moon-faq-item')) c.faqOpen += 1;
    }, { capture: true, signal });

    // Deteksi aktivitas seleksi teks (hanya memeriksa isCollapsed, isi teks tidak dibaca)
    let selecting = false;
    let timer = null;
    rt.timers.selection = null;
    document.addEventListener('selectionchange', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const sel = document.getSelection();
            const active = !!sel && !sel.isCollapsed && sel.rangeCount > 0;
            if (active && !selecting) { c.selection += 1; markActivity(); }
            selecting = active;
        }, 400);
        const cur = getRuntime();
        if (cur) cur.timers.selection = timer;
    }, { signal });
}

/** Inisialisasi seluruh event listener pelacakan interaksi */
export function initializeBehaviorTracking() {
    const rt = getRuntime();
    if (!rt) return;
    const { signal } = rt.controller;
    const s = rt.signals;

    trackScrollVelocity();
    observeSectionDwellTime();
    detectUserInteractions();

    // Handler terpadu untuk reset status idle dari berbagai input device
    for (const type of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']) {
        window.addEventListener(type, markActivity, { passive: true, signal });
    }
    armIdleTimer();

    document.addEventListener('visibilitychange', () => {
        flushDwell();                       // Akumulasikan sisa durasi sebelum status visibilitas berubah
        s.visible = document.visibilityState === 'visible';
        if (s.visible) { s.lastActivityAt = nowMs(); scheduleEvaluation(); }
    }, { signal });
}

/** Ambil snapshot metrik dan bangun feature vector ternormalisasi */
export function collectBehaviorFeatures() {
    flushDwell();
    const rt = getRuntime();
    if (!rt) return null;
    const s = rt.signals;
    return buildFeatures({
        dwellMs: s.dwellMs,
        visibleMs: s.visibleMs,
        idleMs: s.idleMs,
        scroll: s.scroll,
        counts: s.counts,
        sectionsSeen: s.seen.size,
    }, rt.cfg);
}
