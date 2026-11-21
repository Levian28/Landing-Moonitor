/**
 * MOONITOR Landing Page — Main Application Orchestrator
 *
 * Mengoordinasikan seluruh sub-modul fungsional:
 * - Navigasi responsif & state header (./navigation.js)
 * - Telemetri live CTA demo (./components/cta-demo.js)
 * - Tab konten interaktif tentang (./components/about-tabs.js)
 * - Modal dialog pratinjau dashboard (./components/preview-dialog.js)
 * - Adaptive behavior layer (./adaptive/index.js)
 *
 * Semua event listener dikelola dengan siklus hidup AbortController terpadu.
 */

import { initializeNavigation } from './navigation.js';
import { initializeCtaDemo } from './components/cta-demo.js';
import { initializeAboutTabs } from './components/about-tabs.js';
import { initializePreviewDialog } from './components/preview-dialog.js';
import { initializeSkeletonLoading } from './components/skeleton.js';
import { startAdaptiveLayer, stopAdaptiveLayer } from './adaptive/index.js';

let session = null; // { controller, signal, intervals }

export function initializeMoonitorLanding() {
    cleanupMoonitorLanding();
    const controller = new AbortController();
    session = { controller, signal: controller.signal, intervals: [] };

    initializeSkeletonLoading(session);
    initializeNavigation(session);
    initializeCtaDemo(session);
    initializeAboutTabs(session);
    initializePreviewDialog(session);

    // Adaptive layer bersifat opsional (progressive enhancement)
    try {
        startAdaptiveLayer();
    } catch (error) {
        console.warn('[moonitor] adaptive layer disabled:', error);
        stopAdaptiveLayer();
    }
}

export function cleanupMoonitorLanding() {
    if (!session) return;
    session.controller.abort();
    session.intervals.forEach((id) => clearInterval(id));
    session = null;
    stopAdaptiveLayer();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMoonitorLanding, { once: true });
} else {
    initializeMoonitorLanding();
}

// Restore dari bfcache: inisialisasi ulang sesi baru karena sesi sebelumnya dibersihkan saat pagehide
window.addEventListener('pagehide', cleanupMoonitorLanding);
window.addEventListener('pageshow', (event) => {
    if (event.persisted) initializeMoonitorLanding();
});
