document.addEventListener('DOMContentLoaded', () => {
    console.log("Скрипт каталога запущен...");

    const grid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('catalog-search');
    const sortSelect = document.getElementById('catalog-sort');
    const filterTabs = document.querySelectorAll('#catalog-filters .font-tab');

    let allProducts = [];

    // Проверка: нашли ли мы элементы?
    if (!grid) console.error("Ошибка: Не найден #catalog-grid");
    if (!searchInput) console.warn("Предупреждение: Не найден #catalog-search");

    async function fetchProducts() {
        try {
            console.log("Запрос к серверу...");
            const response = await fetch('http://localhost:3000/products');
            
            if (!response.ok) throw new Error('Ошибка сервера');
            
            allProducts = await response.json();
            console.log("Товары загружены:", allProducts);
            renderProducts(allProducts);
        } catch (error) {
            console.error('Ошибка fetch:', error);
            if (grid) grid.innerHTML = '<p style="color: red; grid-column: 1/-1;">Ошибка: Запустите json-server в терминале!</p>';
        }
    }

    function renderProducts(products) {
        if (!grid) return;
        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = '<p class="secondary-section-subtitle" style="grid-column: 1/-1;">Ничего не найдено</p>';
            return;
        }

        products.forEach(product => {
            const formattedPrice = new Intl.NumberFormat('ru-RU').format(product.price);
            const badgeHtml = product.popular ? `<span class="badge-popular">ПОПУЛЯРНОЕ</span>` : '';

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
        });
    }

    function updateCatalog() {
        const activeTab = document.querySelector('#catalog-filters .font-tab.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const sortType = sortSelect ? sortSelect.value : 'default';

        console.log(`Обновление: Кат=${activeCategory}, Поиск=${searchQuery}, Сорт=${sortType}`);

        let filtered = allProducts.filter(p => {
            const matchesCategory = (activeCategory === 'all' || p.category === activeCategory);
            const matchesSearch = p.name.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (sortType === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortType === 'price-desc') filtered.sort((a, b) => b.price - a.price);

        renderProducts(filtered);
    }

    // Слушатели событий
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault(); // Останавливаем прыжок вверх
            console.log("Клик по фильтру:", tab.textContent);
            
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateCatalog();
        });
    });

    if (searchInput) searchInput.addEventListener('input', updateCatalog);
    if (sortSelect) sortSelect.addEventListener('change', updateCatalog);

    fetchProducts();
});