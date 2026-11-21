/**
 * Inisialisasi navigasi responsif, status header saat scroll,
 * toggle menu mobile, aksesibilitas keyboard (Esc & tab trapping),
 * dan sinkronisasi indikator aria-current tautan aktif.
 */

/** Sinkron dengan breakpoint 821px di CSS */
const DESKTOP_NAV_QUERY = '(min-width: 821px)';

export function initializeNavigation({ signal }) {
    const header = document.getElementById('moon-header');
    const navigation = document.querySelector('#moon-navigation');
    const menuToggle = document.querySelector('.moon-menu-toggle');

    if (header) {
        let queued = false;
        const update = () => {
            queued = false;
            header.classList.toggle('is-scrolled', window.scrollY > 20);
        };
        update();
        window.addEventListener('scroll', () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
        }, { passive: true, signal });
    }

    if (navigation instanceof HTMLElement && menuToggle instanceof HTMLButtonElement) {
        const setMenu = (open) => {
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
            navigation.classList.toggle('is-open', open);
        };
        const isOpen = () => menuToggle.getAttribute('aria-expanded') === 'true';

        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            setMenu(!isOpen());
        }, { signal });

        navigation.addEventListener('click', (event) => {
            if (event.target instanceof Element && event.target.closest('a')) setMenu(false);
        }, { signal });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape' || !isOpen()) return;
            const focusInside = navigation.contains(document.activeElement);
            setMenu(false);
            if (focusInside) menuToggle.focus(); // Kembalikan fokus ke toggle agar tidak tertinggal di link tersembunyi
        }, { signal });

        document.addEventListener('click', (event) => {
            if (event.target instanceof Node && !navigation.contains(event.target) && !menuToggle.contains(event.target)) {
                setMenu(false);
            }
        }, { signal });

        window.matchMedia(DESKTOP_NAV_QUERY).addEventListener('change', (event) => {
            if (event.matches) setMenu(false);
        }, { signal });
    }

    const navLinks = Array.from(document.querySelectorAll('.moon-nav a'));
    const updateCurrentLink = () => {
        // Default ke #hero saat posisi di puncak halaman (tanpa hash)
        const currentHash = window.location.hash || '#hero';
        navLinks.forEach((link) => {
            if (link.getAttribute('href') === currentHash) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    };
    updateCurrentLink();
    window.addEventListener('hashchange', updateCurrentLink, { signal });
}
