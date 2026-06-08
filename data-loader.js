document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:3000';

    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`Cannot load ${endpoint}`);
            }
            return response.json();
        } catch (apiError) {
            const response = await fetch('./db.json');
            if (!response.ok) {
                throw apiError;
            }

            const db = await response.json();
            if (!Object.prototype.hasOwnProperty.call(db, endpoint)) {
                throw apiError;
            }

            return db[endpoint];
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }

    function renderCatalog(products, grid) {
        const isMainPage = grid.classList.contains('catalog__grid');
        const productsToRender = isMainPage ? products.slice(0, 4) : products;

        grid.innerHTML = productsToRender.map(product => {
            if (isMainPage) {
                return `
                    <div class="catalog-card">
                        <img src="${product.image}" alt="${product.name}" class="catalog-card__img">
                        <div class="catalog-card__info">
                            <h3 class="font-card-title">${product.name}</h3>
                            <p class="font-card-price">от ${formatPrice(product.price)} ₽</p>
                        </div>
                    </div>
                `;
            }

            return `
                <article class="catalog-page-card">
                    <div class="catalog-card-image">
                        ${product.popular ? '<span class="badge-popular">ПОПУЛЯРНОЕ</span>' : ''}
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="catalog-card-content">
                        <h3 class="font-card-title">${product.name}</h3>
                        <div class="catalog-card-meta">
                            <span class="secondary-section-subtitle">Материал: ${product.material}</span>
                        </div>
                        <p class="font-card-price">от ${formatPrice(product.price)} ₽</p>
                    </div>
                    <div class="catalog-card-line"></div>
                </article>
            `;
        }).join('');
    }

    function renderArticles(articles, grid) {
        if (!articles.length) {
            grid.innerHTML = '';
            return;
        }

        const articlesToRender = articles.length >= 18
            ? articles
            : Array.from({ length: 18 }, (_, index) => articles[index % articles.length]);

        grid.innerHTML = articlesToRender.map(article => `
            <article class="article-page-card">
                <div class="article-page-card__image">
                    <img src="${article.image}" alt="${article.alt}" loading="eager" decoding="sync">
                    <div class="article-page-card__badges">
                        ${(article.badges || []).map(badge => `<span>${badge}</span>`).join('')}
                    </div>
                </div>
                <h2 class="font-card-title">${article.title}</h2>
                <div class="article-page-card__meta">
                    <span>${article.date}</span>
                    <span>${article.views}</span>
                </div>
            </article>
        `).join('');
    }

    function renderPromos(promos, list) {
        list.innerHTML = promos.map(promo => `
            <article class="promo-page-item">
                <div class="promo-page-item__img">
                    <img src="${promo.image}" alt="${promo.alt}">
                </div>
                <div class="promo-page-item__content">
                    <h3 class="font-portfolio-desc">${promo.title}</h3>
                    <p class="secondary-section-subtitle">${promo.description}</p>
                </div>
                <div class="promo-page-item__action">
                    <button class="circle-btn-outline" type="button">
                        <img src="./Assets/icons/arrow-right-circle.png" alt="Подробнее">
                    </button>
                </div>
            </article>
        `).join('');
    }

    function renderProjects(projects, grid) {
        grid.innerHTML = projects.map(project => `
            <article class="portfolio-item">
                <div class="portfolio-item__image-container">
                    ${project.star ? '<span class="badge-star">Звездный проект</span>' : ''}
                    <div class="portfolio-item__likes">
                        <img src="./Assets/icons/likes.png" alt="">
                        <span>${project.likes}</span>
                    </div>
                    <img src="${project.image}" alt="${project.title}" class="main-project-img">
                </div>
                <div class="portfolio-item__info">
                    <h3 class="font-card-title">${project.title}</h3>
                    <div class="portfolio-item__meta">
                        <p class="secondary-section-subtitle">${project.style}</p>
                        <p class="secondary-section-subtitle">${project.size}</p>
                    </div>
                    <p class="secondary-section-subtitle designer-label">${project.designer}</p>
                </div>
            </article>
        `).join('');
    }

    function renderReviews(reviews, list) {
        list.innerHTML = reviews.map((review, index) => `
            <article class="review-card" ${index ? 'style="margin-top: 2rem;"' : ''}>
                <div class="review-card__avatar">
                    <img src="${review.avatar}" alt="${review.name}">
                </div>
                <div class="review-card__content">
                    <div class="review-card__info">
                        <h2 class="font-portfolio-desc" style="margin-bottom: 0.6rem;">${review.name}</h2>
                        <p class="secondary-section-subtitle">${review.role}</p>
                    </div>
                    <div class="review-card__text-container">
                        <p class="review-text secondary-section-subtitle" style="white-space: normal; width: 56rem;">
                            ${review.text}
                        </p>
                    </div>
                    <div class="review-card__gallery">
                        ${(review.gallery || []).map(src => `<img src="${src}" alt="${review.name}">`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    }

    async function mount(selector, endpoint, renderer) {
        const node = document.querySelector(selector);
        if (!node) return;

        try {
            const data = await fetchData(endpoint);
            renderer(data, node);
            if (window.NeffI18n) {
                try {
                    window.NeffI18n.setLanguage?.(localStorage.getItem('selectedLang') || 'ru');
                } catch (i18nError) {
                    console.warn(i18nError);
                }
            }
        } catch (error) {
            console.error(error);
            node.innerHTML = '<p class="secondary-section-subtitle">Ошибка загрузки данных</p>';
        }
    }

    mount('[data-json="products"]', 'products', renderCatalog);
    mount('[data-json="articles"]', 'articles', renderArticles);
    mount('[data-json="promos"]', 'promos', renderPromos);
    mount('[data-json="projects"]', 'projects', renderProjects);
    mount('[data-json="reviews"]', 'reviews', renderReviews);
});
