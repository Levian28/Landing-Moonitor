import { UNCERTAIN } from './constants.js';
import { getRuntime } from './state.js';
import { collectBehaviorFeatures, debugLog, nowMs } from './tracker.js';
import { hasSufficientObservations } from './features.js';
import { getTensorFlowStatus } from './tensorflow.js';
import { predictVisitorPersona } from './classifier.js';
import { adaptLandingPage } from './dom.js';

export function createDecisionState() {
    return { applied: null, lastAppliedAt: null, candidate: null, candidateCount: 0 };
}

/**
 * Menentukan apakah perubahan persona diizinkan diterapkan ke UI saat ini.
 * Memeriksa threshold confidence, debounce konfirmasi berturut-turut, dan jeda cooldown.
 */
export function decideAdaptation(result, state, cfg, now) {
    const no = (reason) => ({ apply: false, reason });
    if (!result || result.persona === UNCERTAIN) {
        state.candidate = null; state.candidateCount = 0;
        return no('uncertain');
    }
    const threshold = result.method === 'tensorflow' ? cfg.tf.minConfidence : cfg.heuristic.minConfidence;
    if (result.confidence < threshold) { state.candidate = null; state.candidateCount = 0; return no('below-threshold'); }
    if (result.persona === state.applied) { state.candidate = null; state.candidateCount = 0; return no('unchanged'); }
    if (state.applied && result.confidence < threshold + cfg.switchBonus) return no('switch-margin');

    if (state.candidate === result.persona) state.candidateCount += 1;
    else { state.candidate = result.persona; state.candidateCount = 1; }
    if (state.candidateCount < cfg.confirmations) return no('awaiting-confirmation');

    if (state.lastAppliedAt !== null && now - state.lastAppliedAt < cfg.cooldownMs) return no('cooldown');
    return { apply: true, reason: 'ok', persona: result.persona };
}

export function scheduleEvaluation(delay) {
    const rt = getRuntime();
    if (!rt || rt.timers.evaluate) return;
    rt.timers.evaluate = setTimeout(runEvaluation, delay ?? rt.cfg.evaluateEveryMs);
}

export function runEvaluation() {
    const rt = getRuntime();
    if (!rt) return;
    rt.timers.evaluate = null;
    const s = rt.signals;
    if (!s.visible || s.idle) return; // Jeda evaluasi jika tab tidak terlihat atau pengguna idle

    const features = collectBehaviorFeatures();
    if (!features) return;
    const tfLoading = getTensorFlowStatus().status === 'loading';
    if (!hasSufficientObservations(features.meta, rt.cfg) || tfLoading) {
        scheduleEvaluation();
        return;
    }

    const result = predictVisitorPersona(features, rt.cfg, rt.methodLock);
    rt.lastResult = result;
    const decision = decideAdaptation(result, rt.decision, rt.cfg, nowMs());
    debugLog(result.persona, result.confidence.toFixed(2), result.method, decision.reason);
    if (rt.cfg.debug) {
        document.dispatchEvent(new CustomEvent('moonitor:adaptive', {
            detail: { result, decision: decision.reason, features: features.named },
        }));
    }
    if (decision.apply) {
        adaptLandingPage(decision.persona);
        rt.decision.applied = decision.persona;
        rt.decision.lastAppliedAt = nowMs();
        rt.decision.candidate = null;
        rt.decision.candidateCount = 0;
    }
    scheduleEvaluation();
}
