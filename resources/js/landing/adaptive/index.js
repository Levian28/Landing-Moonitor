import { sanitizeConfig } from './config.js';
import { getRuntime, setRuntime } from './state.js';
import { createSignals, initializeBehaviorTracking, nowMs } from './tracker.js';
import { createDecisionState, scheduleEvaluation } from './engine.js';
import { collectAdaptiveRegistry, observeAdaptiveTargets, restoreDefaults } from './dom.js';
import { disposeTensorFlow, initializeTensorFlow } from './tensorflow.js';

export * from './constants.js';
export * from './config.js';
export * from './features.js';
export * from './classifier.js';
export * from './tensorflow.js';
export * from './tracker.js';
export * from './dom.js';
export * from './engine.js';

export function readPageConfig() {
    const raw = {};
    const envUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_MOONITOR_MODEL_URL : undefined;
    if (envUrl) raw.modelUrl = envUrl;
    const attr = document.body?.dataset.adaptiveConfig;
    if (attr) {
        try { Object.assign(raw, JSON.parse(attr)); } catch { /* Abaikan atribut konfigurasi yang invalid */ }
    }
    if (document.body?.dataset.adaptive === 'off') raw.enabled = false;
    return raw;
}

/**
 * Inisialisasi runtime adaptif. Idempoten: memanggil ulang akan me-restart sesi secara bersih.
 * Mengembalikan false jika browser tidak memenuhi prasyarat dukungan API.
 */
export function startAdaptiveLayer(overrides) {
    stopAdaptiveLayer();
    const cfg = sanitizeConfig({ ...readPageConfig(), ...(overrides || {}) });
    if (!cfg.enabled) return false;
    if (typeof IntersectionObserver === 'undefined') return false;

    const t0 = nowMs();
    const rt = {
        cfg,
        controller: new AbortController(),
        signals: createSignals(t0),
        observers: {},
        timers: {},
        decision: createDecisionState(),
        methodLock: { method: null },
        programmaticScrollUntil: 0,
        lastResult: null,
        registry: null,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
    };
    setRuntime(rt);

    rt.registry = collectAdaptiveRegistry();
    observeAdaptiveTargets();
    initializeBehaviorTracking();
    scheduleEvaluation();

    // Muat library TensorFlow saat browser idle dan halaman telah selesai dimuat
    if (cfg.modelUrl) {
        const kick = () => { if (getRuntime()) initializeTensorFlow(rt.cfg); };
        const afterLoad = () => ('requestIdleCallback' in window ? requestIdleCallback(kick, { timeout: 4000 }) : setTimeout(kick, 1500));
        if (document.readyState === 'complete') afterLoad();
        else window.addEventListener('load', afterLoad, { once: true, signal: rt.controller.signal });
    }
    return true;
}

/** Hentikan runtime, bersihkan observer/timer, dan pulihkan konten default */
export function stopAdaptiveLayer() {
    const rt = getRuntime();
    if (!rt) return;
    restoreDefaults();
    rt.controller.abort();
    Object.values(rt.observers).forEach((o) => o?.disconnect());
    Object.values(rt.timers).forEach((id) => clearTimeout(id));
    disposeTensorFlow();
    setRuntime(null);
}

/** Akses read-only snapshot runtime untuk pengujian */
export function _peekRuntimeForTests() {
    const rt = getRuntime();
    return rt ? { signals: rt.signals, decision: rt.decision, lastResult: rt.lastResult, cfg: rt.cfg, methodLock: rt.methodLock } : null;
}
