/**
 * Komponen Tab Interaktif "Tentang".
 * Mendukung navigasi keyboard WAI-ARIA (panah, Home, End),
 * kloning template dinamis, dan kalkulasi penguncian tinggi minimum
 * guna mencegah Cumulative Layout Shift (CLS) saat berpindah tab.
 */
export function initializeAboutTabs({ signal }) {
    const tabs = Array.from(document.querySelectorAll('[data-about-tab]'));
    const panel = document.querySelector('[data-about-content]');
    if (tabs.length === 0 || !(panel instanceof HTMLElement)) return;

    const templates = new Map(
        Array.from(document.querySelectorAll('[data-about-template]')).map((t) => [t.dataset.aboutTemplate, t]),
    );

    const selectTab = (tab, moveFocus = false) => {
        const template = templates.get(tab.dataset.aboutTab);
        if (!(template instanceof HTMLTemplateElement)) return;

        tabs.forEach((item) => {
            const selected = item === tab;
            item.classList.toggle('is-active', selected);
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
        });

        panel.classList.remove('is-changing');
        void panel.offsetWidth; // Restart CSS animation
        panel.replaceChildren(template.content.cloneNode(true));
        panel.classList.add('is-changing');
        document.querySelector('#about-panel')?.setAttribute('aria-labelledby', tab.id);
        if (moveFocus) tab.focus();
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectTab(tab), { signal });
        tab.addEventListener('keydown', (event) => {
            let next;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = tabs.length - 1;
            else return;
            event.preventDefault();
            selectTab(tabs[next], true);
        }, { signal });
    });

    // Kunci tinggi panel ke tab tertinggi untuk mencegah layout shift saat berpindah tab
    const host = panel.closest('.moon-about-panel');
    if (!(host instanceof HTMLElement)) return;
    let lastWidth = 0;
    const measure = () => {
        const width = panel.clientWidth;
        if (!width) return;
        lastWidth = width;
        const probe = document.createElement('div');
        probe.className = panel.className.replace('is-changing', '').trim();
        probe.setAttribute('aria-hidden', 'true');
        probe.inert = true;
        probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;width:${width}px`;
        host.append(probe);
        let tallest = 0;
        templates.forEach((tpl) => {
            probe.replaceChildren(tpl.content.cloneNode(true));
            tallest = Math.max(tallest, probe.offsetHeight);
        });
        probe.remove();
        const cs = getComputedStyle(host);
        const chrome = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']
            .reduce((sum, key) => sum + (parseFloat(cs[key]) || 0), 0);
        // Konten tab awal dirender server, perhitungkan jika lebih tinggi dari template
        tallest = Math.max(tallest, panel.offsetHeight);
        host.style.setProperty('--about-panel-min', `${Math.ceil(tallest + chrome)}px`);
    };

    let timer = null;
    window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (panel.clientWidth !== lastWidth) {
                host.style.removeProperty('--about-panel-min');
                measure();
            }
        }, 150);
    }, { signal });
    measure();
    document.fonts?.ready.then(() => {
        if (!signal.aborted) {
            host.style.removeProperty('--about-panel-min');
            measure();
        }
    });
}
