document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('catalog-grid');

    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            
            const products = await response.json();
            
            renderProducts(products);
        } catch (error) {
            console.error('Ошибка:', error);
            if (grid) grid.innerHTML = '<p class="secondary-section-subtitle">Не удалось загрузить каталог...</p>';
        }
    }

    function renderProducts(products) {
        if (!grid) return;
        grid.innerHTML = '';

        products.forEach(product => {
            const formattedPrice = new Intl.NumberFormat('ru-RU').format(product.price);

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
        });
    }

    fetchProducts();
});