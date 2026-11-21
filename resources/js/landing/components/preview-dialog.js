/**
 * Dialog pratinjau dashboard interaktif.
 * Menggunakan elemen <dialog> native HTML untuk focus trapping,
 * penanganan tombol Esc otomatis, dan klik backdrop overlay.
 */
import { trackImageSkeleton } from './skeleton.js';

export function initializePreviewDialog({ signal }) {
    const opener = document.querySelector('[data-preview-open]');
    const dialog = document.getElementById('imageModal');
    const preview = document.getElementById('previewImg');
    const modalImg = document.getElementById('modalImage');
    const closeButton = document.getElementById('closeModal');
    if (!opener || !(dialog instanceof HTMLDialogElement) || !(preview instanceof HTMLImageElement)
        || !(modalImg instanceof HTMLImageElement) || !closeButton) return;

    const close = () => (dialog.open ? dialog.close() : undefined);

    opener.addEventListener('click', () => {
        modalImg.src = preview.currentSrc || preview.src;
        modalImg.alt = preview.alt;
        const scrollContainer = dialog.querySelector('[data-skeleton="modal-preview"]');
        if (scrollContainer instanceof HTMLElement) {
            trackImageSkeleton(modalImg, scrollContainer, { signal });
        }
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
    }, { signal });

    closeButton.addEventListener('click', close, { signal });
    dialog.addEventListener('click', (event) => {
        // Klik di luar konten gambar atau tombol ditafsirkan sebagai klik backdrop
        if (event.target instanceof Element && !event.target.closest('img, button')) close();
    }, { signal });
}
