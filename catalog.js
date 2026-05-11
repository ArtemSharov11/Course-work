document.addEventListener('DOMContentLoaded', () => {
    const catalogGrid = document.getElementById('catalog-grid');

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            const products = await response.json();

            if (catalogGrid && Array.isArray(products)) {
                catalogGrid.innerHTML = ''; 

                products.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'catalog-card';
                    card.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="catalog-card__img">
                        <div class="catalog-card__info">
                            <h3 class="font-card-title">${item.name}</h3>
                            <p class="font-card-price">от ${item.price.toLocaleString()} ₽</p>
                        </div>
                    `;
                    catalogGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    loadProducts();
});