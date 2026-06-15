document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:3000';

    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE}/${endpoint}`);
            if (!response.ok) throw new Error(`Cannot load ${endpoint}`);
            return response.json();
        } catch (apiError) {
            const response = await fetch('./db.json');
            if (!response.ok) throw apiError;
            const db = await response.json();
            if (!Object.prototype.hasOwnProperty.call(db, endpoint)) throw apiError;
            return db[endpoint];
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }

    function normalizeFilterValue(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/\u0451/g, '\u0435')
            .replace(/[^\p{L}\p{N}]+/gu, '-')
            .replace(/^-|-$/g, '');
    }

    function updateQueryParams(values) {
        const url = new URL(window.location.href);
        Object.entries(values).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
            else url.searchParams.delete(key);
        });
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }

    function renderEmptyState(node, message) {
        node.innerHTML = `<p class="collection-empty secondary-section-subtitle">${message}</p>`;
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch {
            return null;
        }
    }

    function renderCatalogPagination(products, grid, currentPage, pageSize) {
        grid.parentElement.querySelector('.catalog-pagination')?.remove();
        const totalPages = Math.ceil(products.length / pageSize);
        if (totalPages <= 1) return;

        const pagination = document.createElement('nav');
        pagination.className = 'catalog-pagination';
        pagination.setAttribute('aria-label', 'Пагинация каталога');
        const pageButton = (label, page, options = {}) => `
            <button
                type="button"
                class="catalog-pagination__button${options.active ? ' is-active' : ''}"
                data-catalog-page="${page}"
                ${options.disabled ? 'disabled' : ''}
                ${options.current ? 'aria-current="page"' : ''}
                aria-label="${options.label || `Страница ${page}`}"
            >${label}</button>
        `;

        let controls = pageButton('‹', currentPage - 1, {
            disabled: currentPage === 1,
            label: 'Предыдущая страница'
        });
        for (let page = 1; page <= totalPages; page++) {
            controls += pageButton(page, page, {
                active: page === currentPage,
                current: page === currentPage
            });
        }
        controls += pageButton('›', currentPage + 1, {
            disabled: currentPage === totalPages,
            label: 'Следующая страница'
        });

        pagination.innerHTML = controls;
        grid.insertAdjacentElement('afterend', pagination);
        pagination.addEventListener('click', event => {
            const button = event.target.closest('[data-catalog-page]');
            if (!button || button.disabled) return;
            updateQueryParams({ page: button.dataset.catalogPage });
            renderCatalog(products, grid);
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function getFilteredProducts(products) {
        const params = new URLSearchParams(window.location.search);
        const query = (document.getElementById('catalog-search')?.value || params.get('q') || '').trim().toLowerCase();
        const category = document.getElementById('catalog-category')?.value || params.get('category') || '';
        const material = document.getElementById('catalog-material')?.value || params.get('material') || '';
        const sort = document.getElementById('catalog-sort')?.value || params.get('sort') || 'default';

        const result = products.filter(product => {
            const searchable = `${product.name} ${product.material} ${product.category}`.toLowerCase();
            return (!query || searchable.includes(query))
                && (!category || product.category === category)
                && (!material || product.material === material);
        });

        if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
        if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        return result;
    }

    function renderCatalog(products, grid) {
        const isMainPage = grid.classList.contains('catalog__grid');
        const isCatalogPage = grid.id === 'catalog-grid' && !isMainPage;
        const filteredProducts = isCatalogPage ? getFilteredProducts([...products]) : products;
        const pageSize = 9;
        const params = new URLSearchParams(window.location.search);
        const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
        const requestedPage = Number(params.get('page')) || 1;
        const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
        const productsToRender = isMainPage
            ? products.slice(0, 4)
            : filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        const currentUser = getCurrentUser();

        if (isCatalogPage) {
            const results = document.getElementById('catalog-results');
            if (results) results.textContent = `Найдено товаров: ${filteredProducts.length}`;
        }
        if (!productsToRender.length) {
            renderEmptyState(grid, 'По выбранным параметрам товары не найдены.');
            grid.parentElement.querySelector('.catalog-pagination')?.remove();
            return;
        }

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
                <article class="catalog-page-card" data-product-id="${product.id}">
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
                        ${currentUser?.role === 'client' ? `
                            <div class="catalog-card-actions">
                                <button class="catalog-action-btn catalog-action-btn--favorite" type="button" data-favorite-product="${product.id}">
                                    В избранное
                                </button>
                                <button class="catalog-action-btn catalog-action-btn--cart" type="button" data-cart-product="${product.id}">
                                    В корзину
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="catalog-card-line"></div>
                </article>
            `;
        }).join('');

        if (isCatalogPage) {
            renderCatalogPagination(filteredProducts, grid, currentPage, pageSize);
        }
    }

    function setupCatalogControls(products, grid) {
        if (grid.id !== 'catalog-grid' || grid.classList.contains('catalog__grid')) return;
        const params = new URLSearchParams(window.location.search);
        const search = document.getElementById('catalog-search');
        const category = document.getElementById('catalog-category');
        const material = document.getElementById('catalog-material');
        const sort = document.getElementById('catalog-sort');
        const reset = document.getElementById('catalog-reset');
        if (!search || !category || !material || !sort || !reset) return;

        [...new Set(products.map(product => product.material))]
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .forEach(value => material.add(new Option(value, value)));
        search.value = params.get('q') || '';
        category.value = params.get('category') || '';
        material.value = params.get('material') || '';
        sort.value = params.get('sort') || 'default';

        const apply = () => {
            updateQueryParams({
                q: search.value.trim(),
                category: category.value,
                material: material.value,
                sort: sort.value === 'default' ? '' : sort.value,
                page: ''
            });
            renderCatalog(products, grid);
        };
        search.addEventListener('input', apply);
        [category, material, sort].forEach(control => control.addEventListener('change', apply));
        reset.addEventListener('click', () => {
            search.value = '';
            category.value = '';
            material.value = '';
            sort.value = 'default';
            apply();
        });
        renderCatalog(products, grid);
    }

    function parseArticleDate(article) {
        const [day, month, year] = String(article.date).split('.').map(Number);
        return new Date(year, month - 1, day).getTime();
    }

    function parseArticleViews(article) {
        return Number(String(article.views).replace(/\D/g, '')) || 0;
    }

    function renderArticles(articles, grid) {
        const params = new URLSearchParams(window.location.search);
        const tag = normalizeFilterValue(params.get('tag'));
        const query = (document.getElementById('articles-search')?.value || params.get('q') || '').trim().toLowerCase();
        const sort = document.getElementById('articles-sort')?.value || params.get('sort') || 'newest';
        const filtered = articles.filter(article => {
            const matchesTag = !tag || (article.badges || []).some(badge => normalizeFilterValue(badge) === tag);
            const searchable = `${article.title} ${(article.badges || []).join(' ')}`.toLowerCase();
            return matchesTag && (!query || searchable.includes(query));
        });

        if (sort === 'newest') filtered.sort((a, b) => parseArticleDate(b) - parseArticleDate(a));
        if (sort === 'oldest') filtered.sort((a, b) => parseArticleDate(a) - parseArticleDate(b));
        if (sort === 'views-desc') filtered.sort((a, b) => parseArticleViews(b) - parseArticleViews(a));
        if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title, 'ru'));

        const results = document.getElementById('articles-results');
        if (results) results.textContent = `Найдено статей: ${filtered.length}`;
        document.querySelectorAll('[data-article-tag]').forEach(tab => {
            tab.classList.toggle('active', normalizeFilterValue(tab.dataset.articleTag) === tag);
        });
        if (!filtered.length) {
            renderEmptyState(grid, 'По выбранным параметрам статьи не найдены.');
            return;
        }

        grid.innerHTML = filtered.map(article => `
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

    function setupArticleControls(articles, grid) {
        const search = document.getElementById('articles-search');
        const sort = document.getElementById('articles-sort');
        const reset = document.getElementById('articles-reset');
        if (!search || !sort || !reset) return;
        const params = new URLSearchParams(window.location.search);
        search.value = params.get('q') || '';
        sort.value = params.get('sort') || 'newest';

        const apply = () => {
            updateQueryParams({
                q: search.value.trim(),
                sort: sort.value === 'newest' ? '' : sort.value
            });
            renderArticles(articles, grid);
        };
        document.querySelectorAll('[data-article-tag]').forEach(tab => {
            tab.addEventListener('click', event => {
                event.preventDefault();
                updateQueryParams({ tag: tab.dataset.articleTag });
                renderArticles(articles, grid);
            });
        });
        search.addEventListener('input', apply);
        sort.addEventListener('change', apply);
        reset.addEventListener('click', () => {
            search.value = '';
            sort.value = 'newest';
            updateQueryParams({ q: '', sort: '', tag: '' });
            renderArticles(articles, grid);
        });
        renderArticles(articles, grid);
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

    function projectSizeGroup(project) {
        const dimensions = String(project.size).match(/\d+/g)?.map(Number) || [];
        const largest = Math.max(...dimensions, 0);
        if (largest < 3500) return 'compact';
        if (largest < 5000) return 'medium';
        return 'large';
    }

    function renderProjects(projects, grid) {
        const style = document.getElementById('portfolio-style')?.value || '';
        const type = document.getElementById('portfolio-type')?.value || '';
        const size = document.getElementById('portfolio-size')?.value || '';
        const query = (document.getElementById('portfolio-search')?.value || '').trim().toLowerCase();
        const sort = document.getElementById('portfolio-sort')?.value || 'default';
        const filtered = projects.filter(project => {
            const searchable = `${project.title} ${project.designer} ${project.style}`.toLowerCase();
            return (!style || project.style === style)
                && (!type || (type === 'star' ? project.star : !project.star))
                && (!size || projectSizeGroup(project) === size)
                && (!query || searchable.includes(query));
        });

        if (sort === 'likes-desc') filtered.sort((a, b) => b.likes - a.likes);
        if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
        const results = document.getElementById('portfolio-results');
        if (results) results.textContent = `Найдено проектов: ${filtered.length}`;
        if (!filtered.length) {
            renderEmptyState(grid, 'По выбранным параметрам проекты не найдены.');
            return;
        }

        grid.innerHTML = filtered.map(project => `
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

    function setupPortfolioControls(projects, grid) {
        const style = document.getElementById('portfolio-style');
        const type = document.getElementById('portfolio-type');
        const size = document.getElementById('portfolio-size');
        const search = document.getElementById('portfolio-search');
        const sort = document.getElementById('portfolio-sort');
        const apply = document.getElementById('portfolio-apply');
        const reset = document.getElementById('portfolio-reset');
        if (!style || !type || !size || !search || !sort || !apply || !reset) return;

        [...new Set(projects.map(project => project.style))]
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .forEach(value => style.add(new Option(value, value)));
        apply.addEventListener('click', () => renderProjects(projects, grid));
        search.addEventListener('keydown', event => {
            if (event.key === 'Enter') renderProjects(projects, grid);
        });
        reset.addEventListener('click', () => {
            style.value = '';
            type.value = '';
            size.value = '';
            search.value = '';
            sort.value = 'default';
            renderProjects(projects, grid);
        });
        renderProjects(projects, grid);
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

    async function mount(selector, endpoint, renderer, setupControls) {
        const node = document.querySelector(selector);
        if (!node) return;
        try {
            const data = await fetchData(endpoint);
            renderer(data, node);
            setupControls?.(data, node);
            if (window.NeffI18n) {
                window.NeffI18n.setLanguage?.(localStorage.getItem('selectedLang') || 'ru');
            }
        } catch (error) {
            console.error(error);
            node.innerHTML = '<p class="secondary-section-subtitle">Ошибка загрузки данных</p>';
        }
    }

    mount('[data-json="products"]', 'products', renderCatalog, setupCatalogControls);
    mount('[data-json="articles"]', 'articles', renderArticles, setupArticleControls);
    mount('[data-json="promos"]', 'promos', renderPromos);
    mount('[data-json="projects"]', 'projects', renderProjects, setupPortfolioControls);
    mount('[data-json="reviews"]', 'reviews', renderReviews);
});
