import { PERSONAS } from './constants.js';
import { getRuntime } from './state.js';

export function collectAdaptiveRegistry() {
    const targets = [];
    document.querySelectorAll('[data-adaptive-target]').forEach((el) => {
        const key = el.dataset.adaptiveTarget;
        const variants = new Map();
        document.querySelectorAll(`template[data-adaptive-for="${CSS.escape(key)}"]`).forEach((tpl) => {
            const persona = tpl.dataset.personaContent;
            if (PERSONAS.includes(persona)) variants.set(persona, tpl);
        });
        if (!variants.size) return; // Lewati jika tidak ada varian untuk slot ini
        const original = document.createDocumentFragment();
        el.childNodes.forEach((n) => original.append(n.cloneNode(true)));
        targets.push({ el, key, variants, original, current: null, inView: true, pending: null });
    });
    const highlights = Array.from(document.querySelectorAll('[data-persona-highlight]')).map((el) => ({
        el,
        personas: (el.dataset.personaHighlight || '').split(/\s+/).filter(Boolean),
    }));
    return { targets, highlights };
}

export function swapTarget(t, persona) {
    const rt = getRuntime();
    const tpl = t.variants.get(persona);
    // Kembalikan ke markup original jika tidak ada varian yang cocok
    const fragment = tpl ? tpl.content.cloneNode(true) : t.original.cloneNode(true);
    t.el.replaceChildren(fragment);
    t.current = persona;
    t.pending = null;
    if (rt && !rt.reducedMotion?.matches && typeof t.el.animate === 'function') {
        t.el.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
    }
}

/**
 * Menerapkan persona ke DOM.
 * Elemen teks yang berada di viewport ditunda perubahannya sampai ter-scroll keluar
 * untuk menghindari layout shift yang mengganggu pembaca.
 */
export function adaptLandingPage(persona) {
    const rt = getRuntime();
    if (!rt?.registry) return { swapped: 0, deferred: 0 };
    let swapped = 0;
    let deferred = 0;
    for (const t of rt.registry.targets) {
        if (t.current === persona) { t.pending = null; continue; }
        if (t.inView) { t.pending = persona; deferred += 1; } else { swapTarget(t, persona); swapped += 1; }
    }
    for (const h of rt.registry.highlights) {
        h.el.classList.toggle('is-persona-match', h.personas.includes(persona));
    }
    return { swapped, deferred };
}

export function observeAdaptiveTargets() {
    if (typeof IntersectionObserver === 'undefined') return;
    const rt = getRuntime();
    if (!rt?.registry) return;

    rt.observers.targets = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            const t = rt.registry.targets.find((x) => x.el === entry.target);
            if (!t) continue;
            t.inView = entry.isIntersecting;
            if (!t.inView && t.pending) swapTarget(t, t.pending); // Terapkan varian pending saat elemen keluar dari viewport
        }
    }, { threshold: 0 });

    rt.registry.targets.forEach((t) => rt.observers.targets.observe(t.el));
}

export function restoreDefaults() {
    const rt = getRuntime();
    if (!rt?.registry) return;
    for (const t of rt.registry.targets) {
        if (t.current !== null) t.el.replaceChildren(t.original.cloneNode(true));
        t.current = null;
        t.pending = null;
    }
    for (const h of rt.registry.highlights) h.el.classList.remove('is-persona-match');
}
