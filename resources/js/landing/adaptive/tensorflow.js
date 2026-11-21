import { DEFAULT_CONFIG, FEATURE_NAMES, FEATURE_SCHEMA, PERSONAS } from './constants.js';
import { resultFromProbabilities } from './classifier.js';

const tfState = { status: 'idle', tf: null, model: null, reason: null, failures: 0 };

export function getTensorFlowStatus() {
    return { status: tfState.status, reason: tfState.reason };
}

function withTimeout(promise, ms, label) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label}-timeout`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function loadScript(src, { integrity, timeoutMs }) {
    return withTimeout(new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = src;
        el.async = true;
        el.crossOrigin = 'anonymous';
        el.referrerPolicy = 'no-referrer';
        if (integrity) el.integrity = integrity;
        el.onload = () => resolve();
        el.onerror = () => { el.remove(); reject(new Error('tf-script-failed')); };
        document.head.append(el);
    }), timeoutMs, 'tf-script');
}

const sameList = (a, b) => Array.isArray(a) && a.length === b.length && a.every((v, i) => v === b[i]);

/**
 * Validasi integritas model: struktur IO, metadata pelatihan (schema & class order),
 * dan distribusi output softmax pada input probe awal.
 */
export function validateModel(tf, model) {
    try {
        if (!model || !Array.isArray(model.inputs) || !Array.isArray(model.outputs)) return 'not-a-layers-model';
        if (model.inputs.length !== 1 || model.outputs.length !== 1) return 'unexpected-io-count';
        const inShape = model.inputs[0].shape;
        const outShape = model.outputs[0].shape;
        if (!inShape || inShape.length !== 2 || inShape[1] !== FEATURE_NAMES.length) return 'input-shape-mismatch';
        if (!outShape || outShape.length !== 2 || outShape[1] !== PERSONAS.length) return 'output-shape-mismatch';

        const meta = typeof model.getUserDefinedMetadata === 'function' ? model.getUserDefinedMetadata() : null;
        const m = meta && meta.moonitor;
        if (!m) return 'missing-training-metadata';
        if (m.schema !== FEATURE_SCHEMA) return 'schema-mismatch';
        if (!sameList(m.featureNames, FEATURE_NAMES)) return 'feature-names-mismatch';
        if (!sameList(m.classes, PERSONAS)) return 'class-order-mismatch';
        if (m.trained !== true) return 'not-marked-trained';

        const probe = tf.tidy(() => model.predict(tf.zeros([1, FEATURE_NAMES.length])).dataSync());
        if (probe.length !== PERSONAS.length) return 'bad-output-length';
        let sum = 0;
        for (const p of probe) {
            if (!Number.isFinite(p) || p < 0 || p > 1) return 'bad-output-values';
            sum += p;
        }
        if (Math.abs(sum - 1) > 1e-3) return 'output-not-softmax';
        return null;
    } catch (err) {
        return `validation-error:${err?.message ?? err}`;
    }
}

/**
 * Inisialisasi library TensorFlow.js dan unduh model jika modelUrl tersedia.
 * Fallback otomatis ke heuristic jika proses gagal atau timeout.
 */
export async function initializeTensorFlow(cfg = DEFAULT_CONFIG) {
    if (tfState.status === 'loading' || tfState.status === 'ready') return getTensorFlowStatus();
    if (!cfg.modelUrl) {
        tfState.status = 'disabled';
        tfState.reason = 'no-model-url';
        return getTensorFlowStatus();
    }
    tfState.status = 'loading';
    tfState.reason = null;
    try {
        if (!globalThis.tf) {
            await loadScript(cfg.tfUrl, { integrity: cfg.tfIntegrity, timeoutMs: cfg.tfLoadTimeoutMs });
        }
        const tf = globalThis.tf;
        if (!tf || typeof tf.loadLayersModel !== 'function') throw new Error('tf-unavailable');

        // Pakai backend CPU untuk efisiensi resource pada model dense berukuran kecil
        await tf.setBackend('cpu');
        await tf.ready();

        const model = await withTimeout(tf.loadLayersModel(cfg.modelUrl), cfg.modelLoadTimeoutMs, 'model');
        const problem = validateModel(tf, model);
        if (problem) {
            model.dispose?.();
            throw new Error(problem);
        }
        tfState.tf = tf;
        tfState.model = model;
        tfState.status = 'ready';
    } catch (err) {
        tfState.status = 'unavailable';
        tfState.reason = err?.message ?? String(err);
    }
    return getTensorFlowStatus();
}

/**
 * Jalankan inferensi pada feature vector. Tensor perantara langsung di-dispose.
 */
export function predictWithTensorFlow(vector, cfg = DEFAULT_CONFIG) {
    if (tfState.status !== 'ready' || !tfState.model || !tfState.tf) return null;
    if (!Array.isArray(vector) || vector.length !== FEATURE_NAMES.length) return null;
    const { tf, model } = tfState;
    try {
        const probs = tf.tidy(() => model.predict(tf.tensor2d([vector], [1, FEATURE_NAMES.length])).dataSync());
        let sum = 0;
        for (const p of probs) {
            if (!Number.isFinite(p) || p < 0 || p > 1) throw new Error('bad-output-values');
            sum += p;
        }
        if (probs.length !== PERSONAS.length || Math.abs(sum - 1) > 1e-3) throw new Error('bad-output-shape');
        return resultFromProbabilities(probs, cfg);
    } catch (err) {
        tfState.failures += 1;
        if (tfState.failures >= 2) {
            tfState.status = 'failed';
            tfState.reason = err?.message ?? String(err);
        }
        return null;
    }
}

export function disposeTensorFlow() {
    try { tfState.model?.dispose?.(); } catch { /* abaikan */ }
    tfState.model = null;
    tfState.tf = null;
    if (tfState.status === 'ready' || tfState.status === 'loading') tfState.status = 'idle';
}

/** Reset state model (untuk test harness) */
export function _resetTensorFlowForTests() {
    disposeTensorFlow();
    tfState.status = 'idle';
    tfState.reason = null;
    tfState.failures = 0;
}
