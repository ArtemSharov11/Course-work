document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('catalog-search');
    const sortSelect = document.getElementById('catalog-sort');
    const filterTabs = document.querySelectorAll('#catalog-filters .font-tab');

    let allProducts = [];

    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) throw new Error('Ошибка сервера');
            
            allProducts = await response.json();
            renderProducts(allProducts);
        } catch (error) {
            console.error('Ошибка fetch:', error);
            if (grid) grid.innerHTML = '<p>Ошибка загрузки данных</p>';
        }
    }

    function renderProducts(products) {
        if (!grid) return;
        grid.innerHTML = '';

        const isMainPage = grid.classList.contains('catalog__grid');

        const productsToRender = isMainPage ? products.slice(0, 4) : products;

        productsToRender.forEach(product => {
            const formattedPrice = new Intl.NumberFormat('ru-RU').format(product.price);
            const badgeHtml = product.popular ? `<span class="badge-popular">ПОПУЛЯРНОЕ</span>` : '';

            if (isMainPage) {
                const card = document.createElement('div');
                card.className = 'catalog-card'; 
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="catalog-card__img">
                    <div class="catalog-card__info">
                        <h3 class="font-card-title">${product.name}</h3>
                        <p class="font-card-price">от ${formattedPrice} ₽</p>
                    </div>
                `;
                grid.appendChild(card);
            } else {
                const card = document.createElement('article');
                card.className = 'catalog-page-card';
                card.innerHTML = `
                    <div class="catalog-card-image">
                        ${badgeHtml}
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="catalog-card-content">
                        <h3 class="font-card-title">${product.name}</h3>
                        <div class="catalog-card-meta">
                            <span class="secondary-section-subtitle">Материал: ${product.material}</span>
                        </div>
                        <p class="font-card-price">от ${formattedPrice} ₽</p>
                    </div>
                    <div class="catalog-card-line"></div>
                `;
                grid.appendChild(card);
            }
        });
    }

    function updateCatalog() {
        const activeTab = document.querySelector('#catalog-filters .font-tab.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const sortType = sortSelect ? sortSelect.value : 'default';

        let filtered = allProducts.filter(p => {
            const matchesCategory = (activeCategory === 'all' || p.category === activeCategory);
            const matchesSearch = p.name.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (sortType === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortType === 'price-desc') filtered.sort((a, b) => b.price - a.price);

        renderProducts(filtered);
    }

    if (filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateCatalog();
            });
        });
    }

    if (searchInput) searchInput.addEventListener('input', updateCatalog);
    if (sortSelect) sortSelect.addEventListener('change', updateCatalog);

    fetchProducts();
});