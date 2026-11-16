(() => {
    const header = document.getElementById('moon-header');
    const navigation = document.querySelector('#moon-navigation');
    const menuToggle = document.querySelector('.moon-menu-toggle');

    if (header) {
        const onScroll = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 20);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (navigation instanceof HTMLElement && menuToggle instanceof HTMLButtonElement) {
        const setMenu = (open) => {
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
            navigation.classList.toggle('is-open', open);
        };

        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            setMenu(!isOpen);
        });

        navigation.addEventListener('click', (event) => {
            if (event.target instanceof Element && event.target.closest('a')) {
                setMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenu(false);
        });

        document.addEventListener('click', (event) => {
            if (event.target instanceof Node && !navigation.contains(event.target) && !menuToggle.contains(event.target)) {
                setMenu(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 821px)').matches) {
                setMenu(false);
            }
        });
    }

    const navLinks = Array.from(document.querySelectorAll('.moon-nav a'));
    const updateCurrentLink = () => {
        const currentHash = window.location.hash || '#dashboard';
        navLinks.forEach((link) => {
            if (link.getAttribute('href') === currentHash) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    updateCurrentLink();
    window.addEventListener('hashchange', updateCurrentLink);

    // ===== Final CTA: contoh data kandang yang bergerak pelan =====
    const ctaStatus = document.querySelector('[data-cta-status]');
    const ctaValues = document.querySelectorAll('[data-cta-value]');

    if (ctaStatus && ctaValues.length
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Batas waspada hanya contoh, sesuaikan dengan standar kandang Anda.
        const metrics = {
            temp: { value: 28, step: 1.2, min: 26, max: 32, warnAbove: 30.5 },
            hum: { value: 65, step: 4, min: 55, max: 80, warnAbove: 75 },
            nh3: { value: 12, step: 4, min: 6, max: 26, warnAbove: 20 },
            h2s: { value: 3, step: 1.5, min: 1, max: 9, warnAbove: 7 },
        };

        setInterval(() => {
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
            ctaStatus.lastChild.textContent = anyWarn ? 'Waspada' : 'Aman';
        }, 2500);
    }

    // ===== Tab "Tentang" =====
    const tabs = Array.from(document.querySelectorAll('[data-about-tab]'));
    const panel = document.querySelector('[data-about-content]');

    if (tabs.length === 0 || !(panel instanceof HTMLElement)) {
        return;
    }

    const templates = new Map(
        Array.from(document.querySelectorAll('[data-about-template]')).map((template) => [
            template.dataset.aboutTemplate,
            template,
        ]),
    );

    const selectTab = (tab, moveFocus = false) => {
        const template = templates.get(tab.dataset.aboutTab);
        if (!(template instanceof HTMLTemplateElement)) {
            return;
        }

        tabs.forEach((item) => {
            const selected = item === tab;
            item.classList.toggle('is-active', selected);
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
        });

        panel.classList.remove('is-changing');
        void panel.offsetWidth;
        panel.replaceChildren(template.content.cloneNode(true));
        panel.classList.add('is-changing');
        document.querySelector('#about-panel')?.setAttribute('aria-labelledby', tab.id);

        if (moveFocus) {
            tab.focus();
        }
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectTab(tab));
        tab.addEventListener('keydown', (event) => {
            let nextIndex;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                nextIndex = (index + 1) % tabs.length;
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = tabs.length - 1;
            } else {
                return;
            }

            event.preventDefault();
            selectTab(tabs[nextIndex], true);
        });
    });
})();