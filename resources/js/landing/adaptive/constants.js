/** Indeks kelas dan urutan output model */
export const PERSONAS = Object.freeze(['developer', 'business', 'skeptic']);
export const UNCERTAIN = 'uncertain';

/** Versi skema fitur; model terlatih wajib menggunakan skema yang sama */
export const FEATURE_SCHEMA = 'moonitor-behavior-v1';

export const SECTION_IDS = Object.freeze([
    'hero', 'promo', 'features', 'about', 'dashboard',
    'technology', 'testimonials', 'faq', 'cta',
]);

/** Urutan fitur pada input vector model */
export const FEATURE_NAMES = Object.freeze([
    ...SECTION_IDS.map((id) => `dwell_${id}`), // Rasio dwell time saat aktif (0..1)
    'scroll_speed',        // Rata-rata kecepatan scroll (saturating)
    'scroll_skim',         // Proporsi sampel scroll cepat
    'scroll_back',         // Frekuensi scroll balik terarah (saturating)
    'idle_ratio',          // Rasio durasi idle terhadap visible time
    'selection_rate',      // Frekuensi seleksi teks (saturating; tanpa membaca isi)
    'faq_open',            // Jumlah item FAQ dibuka (saturating)
    'about_tab_technical', // Klik tab teknis / cara kerja
    'about_tab_benefit',   // Klik tab manfaat / tujuan
    'nav_technical',       // Navigasi ke section teknologi
    'nav_benefit',         // Navigasi ke fitur / dashboard
    'nav_trust',           // Navigasi ke FAQ / testimoni
    'cta_contact',         // Klik CTA kontak
    'preview_open',        // Buka modal pratinjau dashboard
]);

/**
 * Bobot awal heuristic untuk tiap profil persona.
 * Skor bernilai negatif diperbolehkan; total akhir di-clamp minimal 0.
 */
export const HEURISTIC_WEIGHTS = Object.freeze({
    developer: Object.freeze({
        dwell_technology: 1.0, dwell_about: 0.25, dwell_dashboard: 0.35,
        about_tab_technical: 1.1, nav_technical: 0.9,
        preview_open: 0.3, selection_rate: 0.3, scroll_skim: -0.3,
    }),
    business: Object.freeze({
        dwell_promo: 0.5, dwell_features: 0.8, dwell_dashboard: 0.3, dwell_cta: 0.9,
        about_tab_benefit: 1.0, nav_benefit: 0.9, cta_contact: 1.2,
    }),
    skeptic: Object.freeze({
        dwell_faq: 1.0, dwell_testimonials: 0.3, dwell_about: 0.15,
        faq_open: 1.2, nav_trust: 0.9, scroll_back: 0.8,
        idle_ratio: 0.4, selection_rate: 0.4, preview_open: 0.3,
    }),
});

export const DEFAULT_TF_URL = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
// Hash sha384 dari dist/tf.min.js paket npm resmi
export const DEFAULT_TF_INTEGRITY = 'sha384-vE8hbVJ4lezako5rlvE7bY0BVzWlFhZncPlckrqNwcUQpVtgbENTgZ8TBbnPjZre';

export const DEFAULT_CONFIG = Object.freeze({
    enabled: true,
    debug: false, // Dispatch event `moonitor:adaptive` untuk keperluan debug

    // Threshold minimum engagement sebelum klasifikasi pertama dijalankan
    minEngagedMs: 12000,
    minSectionsSeen: 2,

    // Timing interval
    evaluateEveryMs: 4000,
    cooldownMs: 10000, // Cooldown minimum antar perubahan UI adaptif
    idleAfterMs: 20000,

    // Threshold stabilitas
    confirmations: 2,   // Jumlah evaluasi berurutan yang harus sepakat
    switchBonus: 0.08,  // Margin confidence tambahan untuk switch persona yang sudah aktif

    // Parameter evaluasi heuristic
    heuristic: Object.freeze({ minConfidence: 0.55, minMargin: 0.12, minEvidence: 0.25, evidenceFull: 0.9 }),
    weights: HEURISTIC_WEIGHTS,

    // Konstanta half-saturation normalisasi (x / (x + k))
    saturation: Object.freeze({
        scrollSpeed: 900, scrollBack: 2, selection: 2, faqOpen: 1.5,
        tab: 1, nav: 1, cta: 1, preview: 1,
    }),
    fastScrollPxPerSec: 1500,
    scrollSampleMs: 100,
    scrollBackMinPx: 150,

    // Mapping target navigasi ke counter
    navAffinity: Object.freeze({
        teknologi: 'navTech', features: 'navBenefit', dashboard: 'navBenefit',
        testimonials: 'navTrust', faq: 'navTrust',
    }),

    // TensorFlow.js runtime opsional (aktif jika modelUrl disetel)
    modelUrl: null,
    tfUrl: DEFAULT_TF_URL,
    tfIntegrity: DEFAULT_TF_INTEGRITY,
    tfLoadTimeoutMs: 8000,
    modelLoadTimeoutMs: 8000,
    tf: Object.freeze({ minConfidence: 0.6 }),
});
