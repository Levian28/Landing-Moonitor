import { DEFAULT_CONFIG, DEFAULT_TF_URL, SECTION_IDS } from './constants.js';

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
export const sat = (x, k) => (x > 0 ? x / (x + k) : 0);

export const NUMERIC_LIMITS = {
    minEngagedMs: [1000, 120000],
    minSectionsSeen: [1, SECTION_IDS.length],
    evaluateEveryMs: [500, 30000],
    cooldownMs: [8000, 120000], // Cooldown minimal 8 detik
    idleAfterMs: [2000, 120000],
    confirmations: [1, 5],
    switchBonus: [0, 0.5],
};

export function safeUrl(value, { allowTfCdn = false } = {}) {
    if (typeof value !== 'string' || !value) return null;
    try {
        const url = new URL(value, globalThis.location?.href);
        if (globalThis.location && url.origin === globalThis.location.origin) return url.href;
        if (allowTfCdn && url.protocol === 'https:' && url.hostname === 'cdn.jsdelivr.net'
            && url.pathname.startsWith('/npm/@tensorflow/')) return url.href;
    } catch { /* lanjut ke bawah */ }
    return null;
}

export function sanitizeConfig(overrides = {}) {
    const cfg = {
        ...DEFAULT_CONFIG,
        heuristic: { ...DEFAULT_CONFIG.heuristic },
        tf: { ...DEFAULT_CONFIG.tf },
    };
    if (!overrides || typeof overrides !== 'object') return cfg;

    for (const [key, [lo, hi]] of Object.entries(NUMERIC_LIMITS)) {
        if (typeof overrides[key] === 'number' && Number.isFinite(overrides[key])) {
            cfg[key] = clamp(overrides[key], lo, hi);
        }
    }
    if (typeof overrides.minConfidence === 'number') cfg.heuristic.minConfidence = clamp(overrides.minConfidence, 0.34, 0.99);
    if (typeof overrides.minMargin === 'number') cfg.heuristic.minMargin = clamp(overrides.minMargin, 0, 0.9);
    if (typeof overrides.tfMinConfidence === 'number') cfg.tf.minConfidence = clamp(overrides.tfMinConfidence, 0.34, 0.99);
    if (typeof overrides.enabled === 'boolean') cfg.enabled = overrides.enabled;
    if (typeof overrides.debug === 'boolean') cfg.debug = overrides.debug;

    const modelUrl = safeUrl(overrides.modelUrl);
    if (modelUrl) cfg.modelUrl = modelUrl;
    const tfUrl = safeUrl(overrides.tfUrl, { allowTfCdn: true });
    if (tfUrl) {
        cfg.tfUrl = tfUrl;
        if (tfUrl !== DEFAULT_TF_URL) cfg.tfIntegrity = null;
    }
    return cfg;
}
