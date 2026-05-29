const translations = {
    "ru": {
        "logo-subtitle": "Кухни и шкафы",
        "nav-franchise": "франшиза",
        "nav-developer": "застройщику",
        "nav-designer": "дизайнеру",
        "nav-feedback": "обратная связь",
        "nav-kitchens": "кухни",
        "nav-wardrobes": "шкафы",
        "nav-bedrooms": "спальни",
        "nav-bathrooms": "ванные",
        "nav-portfolio": "портфолио",
        "nav-promos": "акции",
        "nav-buyers": "покупателям",
        "btn-order": "ЗАКАЗАТЬ ПРОЕКТ",
        "hero-title": "СУПЕРРАССРОЧКА <br> 0/0/12",
        "hero-subtitle": "Мебель «NEFF» без первоначального взноса и переплаты на 12 месяцев.",
        "about-stat": "заказов выполнено с 2008 года",
        "about-title": "Кухни на заказ от<br>фабрики «NEFF»",
        "about-desc": "Кухни на заказ от фабрики NEFF<br>Мебельная фабрика NEFF. Мы занимаемся разработкой, производством и реализацией мебели в Москве и РФ. Изготовим мебель для Вас за 14 дней. Вся мебель изготавливается<br>по индивидуальному проекту.",
        "btn-free-design": "БЕСПЛАТНЫЙ ДИЗАЙН-ПРОЕКТ",
        "catalog-title": "КАТАЛОГ",
        "btn-more": "СМОТРЕТЬ ЕЩЕ"
    },
    "en": {
        "logo-subtitle": "Kitchens & Wardrobes",
        "nav-franchise": "franchise",
        "nav-developer": "for developers",
        "nav-designer": "for designers",
        "nav-feedback": "feedback",
        "nav-kitchens": "kitchens",
        "nav-wardrobes": "wardrobes",
        "nav-bedrooms": "bedrooms",
        "nav-bathrooms": "bathrooms",
        "nav-portfolio": "portfolio",
        "nav-promos": "promos",
        "nav-buyers": "for buyers",
        "btn-order": "ORDER PROJECT",
        "hero-title": "SUPER INSTALLMENT <br> 0/0/12",
        "hero-subtitle": "NEFF furniture with no down payment and no interest for 12 months.",
        "about-stat": "orders completed<br>since 2008",
        "about-title": "Custom kitchens from<br>NEFF factory",
        "about-desc": "NEFF Furniture Factory. We are engaged in the development, production and sale of furniture according to individual projects.",
        "btn-free-design": "FREE DESIGN PROJECT",
        "catalog-title": "CATALOG",
        "btn-more": "SHOW MORE"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    function applyLanguage(lang) {
        localStorage.setItem('selectedLang', lang);
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            applyLanguage(btn.getAttribute('data-lang'));
        });
    });

    const savedLang = localStorage.getItem('selectedLang') || 'ru';
    applyLanguage(savedLang);
});
