import { DEFAULT_CONFIG, PERSONAS, UNCERTAIN } from './constants.js';
import { getTensorFlowStatus, predictWithTensorFlow } from './tensorflow.js';

export function makeResult(persona, confidence, method, probabilities, extra = {}) {
    return {
        persona,
        classIndex: persona === UNCERTAIN ? -1 : PERSONAS.indexOf(persona),
        confidence,
        method,
        probabilities,
        timestamp: Date.now(),
        ...extra,
    };
}

/**
 * Pengklasifikasi berbasis heuristic bobot.
 * Confidence = rasio skor pemenang dikalikan kecukupan bukti akumulatif.
 */
export function classifyWithHeuristics(named, cfg = DEFAULT_CONFIG) {
    const h = cfg.heuristic;
    const raw = PERSONAS.map((p) => {
        const w = cfg.weights[p] || {};
        let score = 0;
        for (const [feature, weight] of Object.entries(w)) score += weight * (named[feature] || 0);
        return Math.max(0, score);
    });
    const evidence = raw.reduce((a, b) => a + b, 0);
    const uniform = PERSONAS.map(() => 1 / PERSONAS.length);

    if (evidence < h.minEvidence) {
        return makeResult(UNCERTAIN, 0, 'heuristic', uniform, { reason: 'insufficient-evidence' });
    }
    const probs = raw.map((r) => r / evidence);
    const order = probs.map((p, i) => [p, i]).sort((a, b) => b[0] - a[0]);
    const [topP, topI] = order[0];
    const margin = topP - order[1][0];
    const confidence = topP * Math.min(1, evidence / h.evidenceFull);

    if (confidence < h.minConfidence) return makeResult(UNCERTAIN, confidence, 'heuristic', probs, { reason: 'low-confidence' });
    if (margin < h.minMargin) return makeResult(UNCERTAIN, confidence, 'heuristic', probs, { reason: 'low-margin' });
    return makeResult(PERSONAS[topI], confidence, 'heuristic', probs);
}

/** Konversi output probabilitas softmax menjadi result payload terstandar */
export function resultFromProbabilities(probs, cfg = DEFAULT_CONFIG) {
    let top = 0;
    probs.forEach((p, i) => { if (p > probs[top]) top = i; });
    const confidence = probs[top];
    if (confidence < cfg.tf.minConfidence) {
        return makeResult(UNCERTAIN, confidence, 'tensorflow', Array.from(probs), { reason: 'low-confidence' });
    }
    return makeResult(PERSONAS[top], confidence, 'tensorflow', Array.from(probs));
}

/**
 * Evaluasi persona pengunjung. Mengunci metode inferensi pada iterasi pertama
 * agar klasifikasi tidak berfluktuasi antar classifier dalam satu sesi.
 */
export function predictVisitorPersona(features, cfg = DEFAULT_CONFIG, lock = { method: null }) {
    if (lock.method === null) {
        lock.method = getTensorFlowStatus().status === 'ready' ? 'tensorflow' : 'heuristic';
    }
    if (lock.method === 'tensorflow') {
        const result = predictWithTensorFlow(features.vector, cfg);
        if (result) return result;
        lock.method = 'heuristic'; // Fallback permanen ke heuristic jika inference gagal
    }
    return classifyWithHeuristics(features.named, cfg);
}
