/**
 * Skeleton Loading Controller untuk MOONITOR Landing Page.
 *
 * Mengelola state loading setiap komponen visual/media secara mandiri:
 * - Menghindari skeleton flickering jika gambar sudah ada dalam browser cache.
 * - Menangani event 'load' dan 'error' secara granular.
 * - Mengatur atribut aksesibilitas WAI-ARIA (aria-busy, aria-hidden).
 * - Mendukung progressive enhancement (konten tetap tampil jika JS gagal).
 */

export function trackImageSkeleton(img, container, { signal } = {}) {
    if (!(container instanceof HTMLElement) || !(img instanceof HTMLImageElement)) return;

    const setLoaded = () => {
        container.classList.remove('is-loading', 'is-error');
        container.classList.add('is-loaded');
        container.setAttribute('aria-busy', 'false');
    };

    const setError = () => {
        container.classList.remove('is-loading');
        container.classList.add('is-error');
        container.setAttribute('aria-busy', 'false');
    };

    // Jika gambar sudah selesai dimuat dari cache browser (zero-flicker)
    if (img.complete && img.naturalWidth > 0) {
        setLoaded();
        return;
    }

    // Jika gambar sudah gagal sebelum listener terpasang
    if (img.complete && img.naturalWidth === 0 && img.src) {
        setError();
        return;
    }

    // Tandai container sedang memuat
    container.classList.add('is-loading');
    container.classList.remove('is-loaded', 'is-error');
    container.setAttribute('aria-busy', 'true');

    img.addEventListener('load', setLoaded, { once: true, signal });
    img.addEventListener('error', setError, { once: true, signal });
}

export function initializeSkeletonLoading({ signal } = {}) {
    // Aktifkan flag JS agar styling skeleton aktif secara progressive
    document.body.classList.add('moon-has-js');

    const containers = Array.from(document.querySelectorAll('[data-skeleton]'));
    containers.forEach((container) => {
        const type = container.dataset.skeleton;
        const img = container.querySelector('img');

        if (img) {
            trackImageSkeleton(img, container, { signal });
        } else if (type === 'testimonials' || type === 'card') {
            // Untuk komponen teks/font-dependent: sinkron dengan kesiapan web font
            if (document.fonts && document.fonts.status !== 'loaded') {
                container.classList.add('is-loading');
                container.setAttribute('aria-busy', 'true');
                document.fonts.ready.then(() => {
                    if (signal?.aborted) return;
                    container.classList.remove('is-loading');
                    container.classList.add('is-loaded');
                    container.setAttribute('aria-busy', 'false');
                });
            } else {
                container.classList.add('is-loaded');
                container.setAttribute('aria-busy', 'false');
            }
        } else {
            // Container umum default loaded
            container.classList.add('is-loaded');
            container.setAttribute('aria-busy', 'false');
        }
    });
}
