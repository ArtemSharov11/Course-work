document.addEventListener('DOMContentLoaded', () => {
    const STORAGE = {
        theme: 'theme',
        impaired: 'impaired',
        fontSize: 'impairedFontSize',
        colorScheme: 'impairedColorScheme',
        hideImages: 'impairedHideImages'
    };

    const body = document.body;

    function getSaved(key, fallback) {
        return localStorage.getItem(key) || fallback;
    }

    function buildSettingsControls() {
        const wrapper = document.createElement('div');
        wrapper.className = 'menu-settings';
        wrapper.innerHTML = `
            <div class="menu-settings__group">
                <div class="menu-settings__title" data-i18n-static="Language">Язык</div>
                <div class="menu-settings__row" role="group" aria-label="Выбор языка">
                    <button type="button" class="menu-settings__btn lang-btn" data-lang="ru">RU</button>
                    <button type="button" class="menu-settings__btn lang-btn" data-lang="en">EN</button>
                </div>
            </div>

            <div class="menu-settings__group">
                <div class="menu-settings__title" data-i18n-static="Theme">Тема</div>
                <div class="menu-settings__row" role="group" aria-label="Выбор темы">
                    <button type="button" class="menu-settings__btn theme-btn" data-theme="light">Светлая</button>
                    <button type="button" class="menu-settings__btn theme-btn" data-theme="dark">Темная</button>
                </div>
            </div>

            <div class="menu-settings__group">
                <div class="menu-settings__title" data-i18n-static="Accessibility">Версия для слабовидящих</div>
                <button type="button" class="menu-settings__btn menu-settings__btn--wide" id="impaired-toggle">Включить</button>
            </div>

            <div class="menu-settings__group impaired-options">
                <div class="menu-settings__title" data-i18n-static="Font size">Размер шрифта</div>
                <div class="menu-settings__row" role="group" aria-label="Размер шрифта">
                    <button type="button" class="menu-settings__btn font-size-btn" data-font-size="normal">A</button>
                    <button type="button" class="menu-settings__btn font-size-btn" data-font-size="large">A+</button>
                    <button type="button" class="menu-settings__btn font-size-btn" data-font-size="xlarge">A++</button>
                </div>
            </div>

            <div class="menu-settings__group impaired-options">
                <label class="menu-settings__title" for="impaired-color-scheme" data-i18n-static="Color scheme">Цветовая схема</label>
                <select class="menu-settings__select" id="impaired-color-scheme">
                    <option value="black-white">Черный фон, белый текст</option>
                    <option value="black-green">Черный фон, зеленый текст</option>
                    <option value="white-black">Белый фон, черный текст</option>
                    <option value="beige-brown">Бежевый фон, коричневый текст</option>
                    <option value="blue-navy">Голубой фон, темно-синий текст</option>
                </select>
            </div>

            <div class="menu-settings__group impaired-options">
                <label class="menu-settings__check">
                    <input type="checkbox" id="impaired-hide-images">
                    <span data-i18n-static="Hide images">Отключить изображения</span>
                </label>
            </div>

            <button type="button" class="menu-settings__reset" id="settings-reset">Сбросить настройки</button>
        `;
        return wrapper;
    }

    function createMenuNav() {
        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';

        const links = [
            ['catalog.html', 'Кухни'],
            ['#', 'Шкафы'],
            ['#', 'Спальни'],
            ['#', 'Ванные'],
            ['portfolio.html', 'Портфолио'],
            ['promos.html', 'Акции'],
            ['#', 'Покупателям'],
            ['articles.html', 'Статьи'],
            ['reviews.html', 'Отзывы'],
            [localStorage.getItem('currentUser') ? 'dashboard.html' : 'login.html',
                localStorage.getItem('currentUser') ? 'Кабинет' : 'Войти']
        ];

        links.forEach(([href, text]) => {
            const link = document.createElement('a');
            link.href = href;
            link.className = 'font-nav-bottom';
            link.textContent = text;
            nav.appendChild(link);
        });

        return nav;
    }

    function ensureBurgerButton(headerContainer) {
        let button = document.getElementById('burger-btn');
        if (!button && headerContainer) {
            button = document.createElement('button');
            button.type = 'button';
            button.className = 'burger-menu';
            button.id = 'burger-btn';
            button.setAttribute('aria-label', 'Открыть меню');
            button.innerHTML = '<span></span><span></span><span></span>';
            headerContainer.appendChild(button);
        }
        return button;
    }

    function ensureMenu() {
        const header = document.querySelector('.header');
        const headerContainer = document.querySelector('.header__container');
        const burgerButton = ensureBurgerButton(headerContainer);
        let menu = document.getElementById('mobile-menu');

        if (!menu) {
            menu = document.createElement('div');
            menu.className = 'mobile-overlay';
            menu.id = 'mobile-menu';
            menu.innerHTML = `
                <div class="mobile-menu-content">
                    <div class="mobile-menu-header">
                        <div class="header__logo">
                            <div class="font-logo-neff">NEFF</div>
                            <div class="font-logo-subtitle">Кухни и шкафы</div>
                        </div>
                        <button type="button" class="close-menu" id="close-btn" aria-label="Закрыть меню">&times;</button>
                    </div>
                </div>
            `;
            if (header) {
                header.insertAdjacentElement('afterend', menu);
            } else {
                body.insertAdjacentElement('afterbegin', menu);
            }
        }

        const content = menu.querySelector('.mobile-menu-content');
        if (!content.querySelector('.mobile-nav')) {
            content.appendChild(createMenuNav());
        }

        content.querySelectorAll('.menu-settings').forEach(item => item.remove());
        document.querySelectorAll('.settings-controls').forEach(item => item.remove());
        content.appendChild(buildSettingsControls());

        const closeButton = menu.querySelector('#close-btn');

        if (burgerButton && !burgerButton.dataset.settingsBound) {
            burgerButton.dataset.settingsBound = 'true';
            burgerButton.addEventListener('click', () => {
                menu.classList.add('is-open');
                burgerButton.classList.add('is-active');
                body.style.overflow = 'hidden';
            });
        }

        if (closeButton && !closeButton.dataset.settingsBound) {
            closeButton.dataset.settingsBound = 'true';
            closeButton.addEventListener('click', closeMenu);
        }

        if (!menu.dataset.settingsBound) {
            menu.dataset.settingsBound = 'true';
            menu.addEventListener('click', (event) => {
                if (event.target === menu) {
                    closeMenu();
                }
            });
        }

        function closeMenu() {
            menu.classList.remove('is-open');
            if (burgerButton) burgerButton.classList.remove('is-active');
            body.style.overflow = '';
        }
    }

    function applyTheme(theme) {
        body.classList.toggle('dark-theme', theme === 'dark');
        localStorage.setItem(STORAGE.theme, theme);
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.theme === theme);
        });
    }

    function applyImpairedSettings() {
        const enabled = getSaved(STORAGE.impaired, 'off') === 'on';
        const fontSize = getSaved(STORAGE.fontSize, 'normal');
        const colorScheme = getSaved(STORAGE.colorScheme, 'black-green');
        const hideImages = getSaved(STORAGE.hideImages, 'off') === 'on';
        const root = document.documentElement;

        body.classList.toggle('visually-impaired', enabled);
        body.classList.toggle('vi-font-large', enabled && fontSize === 'large');
        body.classList.toggle('vi-font-xlarge', enabled && fontSize === 'xlarge');
        body.classList.toggle('vi-hide-images', enabled && hideImages);
        root.classList.toggle('vi-font-normal', enabled && fontSize === 'normal');
        root.classList.toggle('vi-font-large', enabled && fontSize === 'large');
        root.classList.toggle('vi-font-xlarge', enabled && fontSize === 'xlarge');

        ['black-white', 'black-green', 'white-black', 'beige-brown', 'blue-navy'].forEach(scheme => {
            body.classList.toggle(`vi-scheme-${scheme}`, enabled && colorScheme === scheme);
        });

        document.querySelectorAll('.impaired-options').forEach(item => {
            item.hidden = !enabled;
        });
        document.querySelectorAll('#impaired-toggle').forEach(btn => {
            btn.textContent = enabled ? 'Выключить' : 'Включить';
            btn.classList.toggle('is-active', enabled);
        });
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.fontSize === fontSize);
        });
        document.querySelectorAll('#impaired-color-scheme').forEach(select => {
            select.value = colorScheme;
        });
        document.querySelectorAll('#impaired-hide-images').forEach(input => {
            input.checked = hideImages;
        });
        ensureImageDescriptions();
    }

    function ensureImageDescriptions() {
        document.querySelectorAll('img[alt]').forEach(img => {
            const alt = img.getAttribute('alt').trim();
            if (!alt || img.nextElementSibling?.classList.contains('image-alt-text')) return;

            const label = document.createElement('span');
            label.className = 'image-alt-text';
            label.textContent = `Изображение: ${alt}`;
            img.insertAdjacentElement('afterend', label);
        });
    }

    function bindControls() {
        document.addEventListener('click', event => {
            const langButton = event.target.closest('.lang-btn');
            if (langButton) {
                event.preventDefault();
                const lang = langButton.dataset.lang;
                if (window.NeffI18n) {
                    window.NeffI18n.setLanguage(lang);
                }
                return;
            }

            const themeButton = event.target.closest('.theme-btn');
            if (themeButton) {
                event.preventDefault();
                applyTheme(themeButton.dataset.theme);
                return;
            }

            const impairedButton = event.target.closest('#impaired-toggle');
            if (impairedButton) {
                event.preventDefault();
                const next = getSaved(STORAGE.impaired, 'off') === 'on' ? 'off' : 'on';
                localStorage.setItem(STORAGE.impaired, next);
                if (next === 'on' && !localStorage.getItem(STORAGE.colorScheme)) {
                    localStorage.setItem(STORAGE.colorScheme, 'black-green');
                }
                applyImpairedSettings();
                return;
            }

            const fontButton = event.target.closest('.font-size-btn');
            if (fontButton) {
                event.preventDefault();
                localStorage.setItem(STORAGE.fontSize, fontButton.dataset.fontSize);
                applyImpairedSettings();
                return;
            }

            if (event.target.closest('#settings-reset')) {
                event.preventDefault();
                localStorage.clear();
                window.location.reload();
            }
        });

        document.addEventListener('change', event => {
            if (event.target.matches('#impaired-color-scheme')) {
                localStorage.setItem(STORAGE.colorScheme, event.target.value);
                applyImpairedSettings();
            }

            if (event.target.matches('#impaired-hide-images')) {
                localStorage.setItem(STORAGE.hideImages, event.target.checked ? 'on' : 'off');
                applyImpairedSettings();
            }
        });
    }

    function updateAuthLinks() {
        const authLinks = document.querySelectorAll('.auth-nav-link');
        const currentUserStr = localStorage.getItem('currentUser');
        const headerContacts = document.querySelector('.header__contacts');
        let accountLink = document.querySelector('.account-nav-link');

        if (headerContacts && !accountLink) {
            accountLink = document.createElement('a');
            accountLink.className = 'font-nav-top account-nav-link';
            accountLink.style.marginRight = '0.75rem';
            headerContacts.insertAdjacentElement('afterbegin', accountLink);
        }

        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if (accountLink) {
                accountLink.textContent = currentUser.role === 'admin' ? 'АДМИН-ПАНЕЛЬ' : 'КАБИНЕТ';
                accountLink.href = 'dashboard.html';
            }
            authLinks.forEach(link => {
                link.textContent = currentUser.role === 'admin' ? 'АДМИН-ПАНЕЛЬ' : 'КАБИНЕТ';
                link.href = 'dashboard.html';
            });
        } else {
            if (accountLink) {
                accountLink.textContent = 'ВОЙТИ';
                accountLink.href = 'login.html';
            }
            authLinks.forEach(link => {
                link.textContent = 'ВОЙТИ';
                link.href = 'login.html';
            });
        }
    }

    ensureMenu();
    bindControls();
    if (window.NeffI18n) {
        window.NeffI18n.setLanguage(localStorage.getItem('selectedLang') || 'ru');
    }
    applyTheme(getSaved(STORAGE.theme, 'light'));
    applyImpairedSettings();
    updateAuthLinks();
});
