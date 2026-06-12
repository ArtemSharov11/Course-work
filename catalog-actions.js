document.addEventListener('DOMContentLoaded', () => {
    const api = window.NeffApi;
    const currentUser = api.getCurrentUser();
    if (!currentUser || currentUser.role !== 'client') return;

    let favorites = [];

    async function loadFavorites() {
        try {
            const allFavorites = await api.get('favorites');
            favorites = allFavorites.filter(item => String(item.userId) === String(currentUser.id));
            updateFavoriteButtons();
        } catch (error) {
            console.error(error);
        }
    }

    function updateFavoriteButtons() {
        const favoriteIds = new Set(favorites.map(item => String(item.productId)));
        document.querySelectorAll('[data-favorite-product]').forEach(button => {
            const active = favoriteIds.has(String(button.dataset.favoriteProduct));
            button.classList.toggle('is-active', active);
            button.textContent = active ? 'В избранном' : 'В избранное';
        });
    }

    async function toggleFavorite(productId) {
        const existing = favorites.find(item => String(item.productId) === String(productId));
        if (existing) {
            await api.remove(`favorites/${existing.id}`);
            favorites = favorites.filter(item => String(item.id) !== String(existing.id));
            api.showToast('Товар удален из избранного');
        } else {
            const allFavorites = await api.get('favorites');
            const favorite = await api.post('favorites', {
                id: api.nextId(allFavorites),
                userId: String(currentUser.id),
                productId: String(productId)
            });
            favorites.push(favorite);
            api.showToast('Товар добавлен в избранное');
        }
        updateFavoriteButtons();
    }

    async function addToCart(productId) {
        const allItems = await api.get('cartItems');
        const existing = allItems.filter(item =>
            String(item.userId) === String(currentUser.id) &&
            String(item.productId) === String(productId)
        );
        if (existing.length) {
            await api.patch(`cartItems/${existing[0].id}`, {
                quantity: Number(existing[0].quantity) + 1
            });
        } else {
            await api.post('cartItems', {
                id: api.nextId(allItems),
                userId: String(currentUser.id),
                productId: String(productId),
                quantity: 1
            });
        }
        api.showToast('Товар добавлен в корзину');
    }

    document.addEventListener('click', async event => {
        const favoriteButton = event.target.closest('[data-favorite-product]');
        const cartButton = event.target.closest('[data-cart-product]');
        if (!favoriteButton && !cartButton) return;

        try {
            if (favoriteButton) {
                await toggleFavorite(favoriteButton.dataset.favoriteProduct);
            }
            if (cartButton) {
                await addToCart(cartButton.dataset.cartProduct);
            }
        } catch (error) {
            console.error(error);
            api.showToast('Операция не выполнена. Проверьте JSON Server.', 'error');
        }
    });

    const observer = new MutationObserver(updateFavoriteButtons);
    document.querySelectorAll('[data-json="products"]').forEach(grid => {
        observer.observe(grid, { childList: true });
    });
    loadFavorites();
});
