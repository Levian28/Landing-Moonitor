(() => {
    const navigation = document.querySelector('#moon-navigation');
    const menuToggle = document.querySelector('.moon-menu-toggle');

    if (navigation instanceof HTMLElement && menuToggle instanceof HTMLButtonElement) {
        const closeMenu = () => {
            navigation.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Buka navigasi');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            navigation.classList.toggle('is-open', !isOpen);
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Buka navigasi' : 'Tutup navigasi');
        });

        navigation.addEventListener('click', (event) => {
            if (event.target instanceof Element && event.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (event.target instanceof Node && !navigation.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 681px)').matches) {
                closeMenu();
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
