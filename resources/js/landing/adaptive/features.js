import { DEFAULT_CONFIG, FEATURE_NAMES, SECTION_IDS } from './constants.js';
import { clamp, sat } from './config.js';

/**
 * Ekstraksi & normalisasi fitur snapshot sesi pengunjung.
 * @param {object} snap snapshot sesi mentah (lihat createSignals())
 * @param {object} cfg
 * @returns {{vector:number[], named:Record<string,number>, meta:object}}
 */
export function buildFeatures(snap, cfg = DEFAULT_CONFIG) {
    const s = cfg.saturation;
    const totalDwell = SECTION_IDS.reduce((sum, id) => sum + (snap.dwellMs[id] || 0), 0);
    const named = {};

    for (const id of SECTION_IDS) {
        named[`dwell_${id}`] = totalDwell > 0 ? (snap.dwellMs[id] || 0) / totalDwell : 0;
    }
    const sc = snap.scroll;
    named.scroll_speed = sc.samples > 0 ? sat(sc.sumSpeed / sc.samples, s.scrollSpeed) : 0;
    named.scroll_skim = sc.samples > 0 ? sc.fast / sc.samples : 0;
    named.scroll_back = sat(sc.back, s.scrollBack);
    named.idle_ratio = snap.visibleMs > 0 ? clamp(snap.idleMs / snap.visibleMs, 0, 1) : 0;

    const c = snap.counts;
    named.selection_rate = sat(c.selection, s.selection);
    named.faq_open = sat(c.faqOpen, s.faqOpen);
    named.about_tab_technical = sat(c.aboutTech, s.tab);
    named.about_tab_benefit = sat(c.aboutBenefit, s.tab);
    named.nav_technical = sat(c.navTech, s.nav);
    named.nav_benefit = sat(c.navBenefit, s.nav);
    named.nav_trust = sat(c.navTrust, s.nav);
    named.cta_contact = sat(c.ctaContact, s.cta);
    named.preview_open = sat(c.previewOpen, s.preview);

    const vector = FEATURE_NAMES.map((name) => {
        const v = named[name];
        return Number.isFinite(v) ? clamp(v, 0, 1) : 0;
    });
    return {
        vector,
        named,
        meta: { engagedMs: totalDwell, sectionsSeen: snap.sectionsSeen, visibleMs: snap.visibleMs },
    };
}

/** Gatekeeper: pastikan ada cukup data interaksi sebelum membuat keputusan */
export function hasSufficientObservations(meta, cfg = DEFAULT_CONFIG) {
    return meta.engagedMs >= cfg.minEngagedMs && meta.sectionsSeen >= cfg.minSectionsSeen;
}
