/**
 * Simulasi live telemetry metrik kandang sapi pada komponen CTA akhir.
 * Memperbarui nilai dan status waspada berkala (suhu, kelembapan, NH3, H2S).
 */
export function initializeCtaDemo(state) {
    const ctaStatus = document.querySelector('[data-cta-status]');
    const ctaValues = document.querySelectorAll('[data-cta-value]');
    if (!ctaStatus || !ctaValues.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const metrics = {
        temp: { value: 28, step: 1.2, min: 26, max: 32, warnAbove: 30.5 },
        hum: { value: 65, step: 4, min: 55, max: 80, warnAbove: 75 },
        nh3: { value: 12, step: 4, min: 6, max: 26, warnAbove: 20 },
        h2s: { value: 3, step: 1.5, min: 1, max: 9, warnAbove: 7 },
    };

    state.intervals.push(setInterval(() => {
        if (document.hidden) return; // Lewati pembaruan saat tab tidak aktif
        let anyWarn = false;
        Object.entries(metrics).forEach(([key, m]) => {
            m.value = Math.min(m.max, Math.max(m.min, m.value + (Math.random() - 0.5) * m.step));
            const warn = m.value > m.warnAbove;
            anyWarn = anyWarn || warn;
            const valueEl = document.querySelector(`[data-cta-value="${key}"]`);
            const stateEl = document.querySelector(`[data-cta-state="${key}"]`);
            if (valueEl) valueEl.textContent = String(Math.round(m.value));
            if (stateEl) {
                stateEl.textContent = warn ? 'Waspada' : 'Normal';
                stateEl.classList.toggle('is-warn', warn);
            }
        });
        ctaStatus.classList.toggle('is-warn', anyWarn);
        if (ctaStatus.lastChild) ctaStatus.lastChild.textContent = anyWarn ? 'Waspada' : 'Aman';
    }, 2500));
}
