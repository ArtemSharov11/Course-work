document.addEventListener('DOMContentLoaded', () => {
    const api = window.NeffApi;
    const currentUser = api.requireUser();
    if (!currentUser) return;

    const content = document.getElementById('dashboard-content');
    const tabs = document.getElementById('dashboard-tabs');
    const dialog = document.getElementById('entity-dialog');
    const dialogTitle = document.getElementById('entity-dialog-title');
    const entityForm = document.getElementById('entity-form');
    const formFields = document.getElementById('entity-form-fields');

    const state = {
        currentTab: '',
        products: [],
        users: [],
        orders: [],
        categories: [],
        favorites: [],
        cartItems: [],
        dialogSubmit: null
    };

    const statusNames = {
        new: 'Новый',
        in_progress: 'В работе',
        done: 'Выполнен',
        cancelled: 'Отменен'
    };

    const roleNames = {
        admin: 'Администратор',
        client: 'Клиент'
    };

    const escapeHtml = value => String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const formatPrice = value => `${new Intl.NumberFormat('ru-RU').format(Number(value) || 0)} ₽`;

    function showError(error) {
        console.error(error);
        api.showToast(error.message || 'Не удалось выполнить операцию', 'error');
    }

    function setLoading() {
        content.innerHTML = '<div class="dashboard-empty">Загрузка данных...</div>';
    }

    function renderEmpty(message) {
        return `<div class="dashboard-empty">${escapeHtml(message)}</div>`;
    }

    function renderUserHeader() {
        document.getElementById('dashboard-role').textContent = roleNames[currentUser.role] || currentUser.role;
        document.getElementById('dashboard-title').textContent =
            currentUser.role === 'admin' ? 'Управление сайтом' : 'Личный кабинет';
        document.getElementById('dashboard-user').innerHTML = `
            <strong>${escapeHtml(currentUser.name)}</strong><br>
            ${escapeHtml(currentUser.email)}
        `;
    }

    function createTabs() {
        const items = currentUser.role === 'admin'
            ? [
                ['products', 'Товары'],
                ['users', 'Пользователи'],
                ['orders', 'Заказы']
            ]
            : [
                ['profile', 'Профиль'],
                ['favorites', 'Избранное'],
                ['cart', 'Корзина'],
                ['orders', 'Мои заказы']
            ];

        tabs.innerHTML = items.map(([id, label], index) => `
            <button class="dashboard-tab${index === 0 ? ' is-active' : ''}" type="button" data-tab="${id}">
                ${label}
            </button>
        `).join('');
        state.currentTab = items[0][0];
    }

    async function loadReferenceData() {
        [state.products, state.users, state.orders, state.categories] = await Promise.all([
            api.get('products'),
            api.get('users'),
            api.get('orders'),
            api.get('categories')
        ]);
    }

    function openEntityDialog(title, fields, values, submitHandler) {
        dialogTitle.textContent = title;
        state.dialogSubmit = submitHandler;
        formFields.innerHTML = fields.map(field => {
            const value = values?.[field.name] ?? field.defaultValue ?? '';
            const wideClass = field.wide ? ' dashboard-field--wide' : '';

            if (field.type === 'select') {
                return `
                    <div class="dashboard-field${wideClass}">
                        <label for="field-${field.name}">${field.label}</label>
                        <select id="field-${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                            ${field.options.map(option => `
                                <option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>
                                    ${escapeHtml(option.label)}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                `;
            }

            if (field.type === 'checkbox') {
                return `
                    <div class="dashboard-field${wideClass}">
                        <label>
                            <input type="checkbox" name="${field.name}" ${value ? 'checked' : ''}>
                            ${field.label}
                        </label>
                    </div>
                `;
            }

            return `
                <div class="dashboard-field${wideClass}">
                    <label for="field-${field.name}">${field.label}</label>
                    <input
                        id="field-${field.name}"
                        name="${field.name}"
                        type="${field.type || 'text'}"
                        value="${escapeHtml(value)}"
                        ${field.min !== undefined ? `min="${field.min}"` : ''}
                        ${field.required ? 'required' : ''}
                    >
                </div>
            `;
        }).join('');
        dialog.showModal();
    }

    function getFormPayload() {
        const formData = new FormData(entityForm);
        const payload = Object.fromEntries(formData.entries());
        entityForm.querySelectorAll('input[type="checkbox"]').forEach(input => {
            payload[input.name] = input.checked;
        });
        return payload;
    }

    async function refreshCurrentTab() {
        await loadReferenceData();
        await renderTab(state.currentTab);
    }

    async function renderProfile() {
        const freshUser = await api.get(`users/${currentUser.id}`);
        api.setCurrentUser(freshUser);
        Object.assign(currentUser, freshUser);
        renderUserHeader();

        content.innerHTML = `
            <div class="dashboard-toolbar"><h2>Данные профиля</h2></div>
            <form class="dashboard-profile dashboard-form-grid" id="profile-form">
                <div class="dashboard-field dashboard-field--wide">
                    <label for="profile-name">ФИО</label>
                    <input id="profile-name" name="name" value="${escapeHtml(freshUser.name)}" required>
                </div>
                <div class="dashboard-field">
                    <label for="profile-email">Email</label>
                    <input id="profile-email" name="email" type="email" value="${escapeHtml(freshUser.email)}" required>
                </div>
                <div class="dashboard-field">
                    <label for="profile-phone">Телефон</label>
                    <input id="profile-phone" name="phone" value="${escapeHtml(freshUser.phone)}" required>
                </div>
                <div class="dashboard-field">
                    <label for="profile-dob">Дата рождения</label>
                    <input id="profile-dob" name="dob" type="date" value="${escapeHtml(freshUser.dob)}" required>
                </div>
                <div class="dashboard-field">
                    <label for="profile-nickname">Никнейм</label>
                    <input id="profile-nickname" name="nickname" value="${escapeHtml(freshUser.nickname)}" required>
                </div>
                <div class="dashboard-field dashboard-field--wide">
                    <button class="dashboard-btn dashboard-btn--primary" type="submit">Сохранить профиль</button>
                </div>
            </form>
        `;

        document.getElementById('profile-form').addEventListener('submit', async event => {
            event.preventDefault();
            const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
            try {
                const updated = await api.patch(`users/${currentUser.id}`, payload);
                api.setCurrentUser(updated);
                Object.assign(currentUser, updated);
                renderUserHeader();
                api.showToast('Профиль обновлен');
            } catch (error) {
                showError(error);
            }
        });
    }

    async function renderFavorites() {
        const allFavorites = await api.get('favorites');
        state.favorites = allFavorites.filter(item => String(item.userId) === String(currentUser.id));
        const productMap = new Map(state.products.map(product => [String(product.id), product]));
        const items = state.favorites
            .map(favorite => ({ favorite, product: productMap.get(String(favorite.productId)) }))
            .filter(item => item.product);

        content.innerHTML = `
            <div class="dashboard-toolbar">
                <h2>Избранное</h2>
                <a class="dashboard-btn dashboard-btn--primary" href="catalog.html">Открыть каталог</a>
            </div>
            ${items.length ? `
                <div class="dashboard-grid">
                    ${items.map(({ favorite, product }) => `
                        <article class="dashboard-item">
                            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
                            <div class="dashboard-item__body">
                                <h3>${escapeHtml(product.name)}</h3>
                                <p>${formatPrice(product.price)}</p>
                                <div class="dashboard-item__actions">
                                    <button class="dashboard-btn dashboard-btn--primary" data-add-cart="${escapeHtml(product.id)}">В корзину</button>
                                    <button class="dashboard-btn dashboard-btn--danger" data-remove-favorite="${escapeHtml(favorite.id)}">Удалить</button>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            ` : renderEmpty('В избранном пока нет товаров.')}
        `;
    }

    async function addProductToCart(productId) {
        const allItems = await api.get('cartItems');
        const existing = allItems.filter(item =>
            String(item.userId) === String(currentUser.id) &&
            String(item.productId) === String(productId)
        );
        if (existing.length) {
            await api.patch(`cartItems/${existing[0].id}`, { quantity: Number(existing[0].quantity) + 1 });
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

    async function renderCart() {
        const allCartItems = await api.get('cartItems');
        state.cartItems = allCartItems.filter(item => String(item.userId) === String(currentUser.id));
        const productMap = new Map(state.products.map(product => [String(product.id), product]));
        const items = state.cartItems
            .map(cartItem => ({ cartItem, product: productMap.get(String(cartItem.productId)) }))
            .filter(item => item.product);
        const total = items.reduce(
            (sum, item) => sum + Number(item.product.price) * Number(item.cartItem.quantity),
            0
        );

        content.innerHTML = `
            <div class="dashboard-toolbar"><h2>Корзина</h2></div>
            ${items.length ? `
                <div class="dashboard-table-wrap">
                    <table class="dashboard-table">
                        <thead>
                            <tr><th>Товар</th><th>Цена</th><th>Количество</th><th>Сумма</th><th>Действия</th></tr>
                        </thead>
                        <tbody>
                            ${items.map(({ cartItem, product }) => `
                                <tr>
                                    <td>${escapeHtml(product.name)}</td>
                                    <td>${formatPrice(product.price)}</td>
                                    <td>
                                        <input
                                            class="dashboard-search"
                                            style="width: 5rem"
                                            type="number"
                                            min="1"
                                            value="${Number(cartItem.quantity)}"
                                            data-cart-quantity="${escapeHtml(cartItem.id)}"
                                        >
                                    </td>
                                    <td>${formatPrice(Number(product.price) * Number(cartItem.quantity))}</td>
                                    <td>
                                        <button class="dashboard-btn dashboard-btn--danger" data-remove-cart="${escapeHtml(cartItem.id)}">
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="dashboard-summary">
                    <strong>Итого: ${formatPrice(total)}</strong>
                    <button class="dashboard-btn dashboard-btn--primary" id="create-order">Оформить заказ</button>
                </div>
            ` : renderEmpty('Корзина пуста.')}
        `;
    }

    async function createOrderFromCart() {
        if (!state.cartItems.length) return;
        const productMap = new Map(state.products.map(product => [String(product.id), product]));
        const orderItems = state.cartItems.map(item => {
            const product = productMap.get(String(item.productId));
            return {
                productId: String(item.productId),
                quantity: Number(item.quantity),
                price: Number(product?.price || 0)
            };
        });
        const allOrders = await api.get('orders');
        const order = {
            id: api.nextId(allOrders),
            userId: String(currentUser.id),
            items: orderItems,
            productIds: orderItems.flatMap(item => Array(item.quantity).fill(item.productId)),
            status: 'new',
            total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            createdAt: new Date().toISOString()
        };

        await api.post('orders', order);
        await Promise.all(state.cartItems.map(item => api.remove(`cartItems/${item.id}`)));
        api.showToast('Заказ успешно создан');
        await refreshCurrentTab();
    }

    function getOrderProductNames(order) {
        const productMap = new Map(state.products.map(product => [String(product.id), product.name]));
        const ids = order.items?.length
            ? order.items.map(item => item.productId)
            : order.productIds || [];
        return ids.map(id => productMap.get(String(id)) || `Товар #${id}`).join(', ');
    }

    async function renderClientOrders() {
        const orders = state.orders.filter(order => String(order.userId) === String(currentUser.id));
        content.innerHTML = `
            <div class="dashboard-toolbar"><h2>Мои заказы</h2></div>
            ${orders.length ? `
                <div class="dashboard-table-wrap">
                    <table class="dashboard-table">
                        <thead>
                            <tr><th>Номер</th><th>Товары</th><th>Статус</th><th>Сумма</th><th>Действия</th></tr>
                        </thead>
                        <tbody>
                            ${orders.map(order => `
                                <tr>
                                    <td>#${escapeHtml(order.id)}</td>
                                    <td>${escapeHtml(getOrderProductNames(order))}</td>
                                    <td><span class="dashboard-status">${escapeHtml(statusNames[order.status] || order.status)}</span></td>
                                    <td>${formatPrice(order.total)}</td>
                                    <td>
                                        <button
                                            class="dashboard-btn dashboard-btn--danger"
                                            data-cancel-order="${escapeHtml(order.id)}"
                                            ${order.status !== 'new' ? 'disabled' : ''}
                                        >Отменить</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : renderEmpty('У вас пока нет заказов.')}
        `;
    }

    function productFields() {
        return [
            { name: 'name', label: 'Название', required: true, wide: true },
            { name: 'price', label: 'Цена', type: 'number', min: 1, required: true },
            {
                name: 'category',
                label: 'Категория',
                type: 'select',
                required: true,
                options: state.categories.map(category => ({ value: category.id, label: category.name }))
            },
            { name: 'material', label: 'Материал', required: true },
            { name: 'image', label: 'Путь к изображению', required: true, wide: true },
            { name: 'popular', label: 'Популярный товар', type: 'checkbox', wide: true }
        ];
    }

    async function renderAdminProducts() {
        content.innerHTML = `
            <div class="dashboard-toolbar">
                <h2>Товары</h2>
                <div class="dashboard-toolbar__actions">
                    <input class="dashboard-search" id="admin-product-search" placeholder="Поиск товара">
                    <button class="dashboard-btn dashboard-btn--primary" id="add-product">Добавить товар</button>
                </div>
            </div>
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr><th>Фото</th><th>Название</th><th>Категория</th><th>Материал</th><th>Цена</th><th>Действия</th></tr>
                    </thead>
                    <tbody id="products-table-body"></tbody>
                </table>
            </div>
        `;

        const tableBody = document.getElementById('products-table-body');
        const renderRows = products => {
            tableBody.innerHTML = products.map(product => `
                <tr>
                    <td><img class="dashboard-table__image" src="${escapeHtml(product.image)}" alt=""></td>
                    <td>${escapeHtml(product.name)}</td>
                    <td>${escapeHtml(state.categories.find(item => item.id === product.category)?.name || product.category)}</td>
                    <td>${escapeHtml(product.material)}</td>
                    <td>${formatPrice(product.price)}</td>
                    <td>
                        <div class="dashboard-table__actions">
                            <button class="dashboard-btn dashboard-btn--secondary" data-edit-product="${escapeHtml(product.id)}">Изменить</button>
                            <button class="dashboard-btn dashboard-btn--danger" data-delete-product="${escapeHtml(product.id)}">Удалить</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        };
        renderRows(state.products);

        document.getElementById('admin-product-search').addEventListener('input', event => {
            const query = event.target.value.toLowerCase().trim();
            renderRows(state.products.filter(product => product.name.toLowerCase().includes(query)));
        });

        document.getElementById('add-product').addEventListener('click', () => {
            openEntityDialog(
                'Новый товар',
                productFields(),
                { image: './Assets/img/kitchen-1.png', category: state.categories[0]?.id },
                async payload => {
                    const allProducts = await api.get('products');
                    await api.post('products', {
                        id: api.nextId(allProducts),
                        ...payload,
                        price: Number(payload.price)
                    });
                    api.showToast('Товар создан');
                    await refreshCurrentTab();
                }
            );
        });
    }

    function userFields(isCreate = false) {
        const fields = [
            { name: 'name', label: 'ФИО', required: true, wide: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Телефон', required: true },
            { name: 'dob', label: 'Дата рождения', type: 'date', required: true },
            { name: 'nickname', label: 'Никнейм', required: true },
            {
                name: 'role',
                label: 'Роль',
                type: 'select',
                options: [
                    { value: 'client', label: 'Клиент' },
                    { value: 'admin', label: 'Администратор' }
                ]
            }
        ];
        if (isCreate) {
            fields.push({ name: 'password', label: 'Пароль', type: 'password', required: true, wide: true });
        }
        return fields;
    }

    async function renderAdminUsers() {
        content.innerHTML = `
            <div class="dashboard-toolbar">
                <h2>Пользователи</h2>
                <button class="dashboard-btn dashboard-btn--primary" id="add-user">Добавить пользователя</button>
            </div>
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr><th>ФИО</th><th>Email</th><th>Никнейм</th><th>Роль</th><th>Действия</th></tr>
                    </thead>
                    <tbody>
                        ${state.users.map(user => `
                            <tr>
                                <td>${escapeHtml(user.name)}</td>
                                <td>${escapeHtml(user.email)}</td>
                                <td>${escapeHtml(user.nickname)}</td>
                                <td><span class="dashboard-status">${escapeHtml(roleNames[user.role] || user.role)}</span></td>
                                <td>
                                    <div class="dashboard-table__actions">
                                        <button class="dashboard-btn dashboard-btn--secondary" data-edit-user="${escapeHtml(user.id)}">Изменить</button>
                                        <button
                                            class="dashboard-btn dashboard-btn--danger"
                                            data-delete-user="${escapeHtml(user.id)}"
                                            ${String(user.id) === String(currentUser.id) ? 'disabled title="Нельзя удалить текущую учетную запись"' : ''}
                                        >Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('add-user').addEventListener('click', () => {
            openEntityDialog(
                'Новый пользователь',
                userFields(true),
                { role: 'client' },
                async payload => {
                    const allUsers = await api.get('users');
                    await api.post('users', { id: api.nextId(allUsers), ...payload });
                    api.showToast('Пользователь создан');
                    await refreshCurrentTab();
                }
            );
        });
    }

    function orderFields() {
        return [
            {
                name: 'userId',
                label: 'Пользователь',
                type: 'select',
                options: state.users.map(user => ({ value: user.id, label: `${user.name} (${user.email})` }))
            },
            {
                name: 'status',
                label: 'Статус',
                type: 'select',
                options: Object.entries(statusNames).map(([value, label]) => ({ value, label }))
            },
            {
                name: 'productIds',
                label: 'ID товаров через запятую',
                required: true,
                wide: true
            }
        ];
    }

    function normalizeOrderPayload(payload) {
        const productIds = String(payload.productIds)
            .split(',')
            .map(value => value.trim())
            .filter(Boolean);
        const productMap = new Map(state.products.map(product => [String(product.id), product]));
        const items = productIds.map(productId => ({
            productId,
            quantity: 1,
            price: Number(productMap.get(productId)?.price || 0)
        }));
        return {
            userId: String(payload.userId),
            status: payload.status,
            productIds,
            items,
            total: items.reduce((sum, item) => sum + item.price, 0)
        };
    }

    async function renderAdminOrders() {
        const userMap = new Map(state.users.map(user => [String(user.id), user]));
        content.innerHTML = `
            <div class="dashboard-toolbar">
                <h2>Заказы</h2>
                <button class="dashboard-btn dashboard-btn--primary" id="add-order">Добавить заказ</button>
            </div>
            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr><th>Номер</th><th>Клиент</th><th>Товары</th><th>Статус</th><th>Сумма</th><th>Действия</th></tr>
                    </thead>
                    <tbody>
                        ${state.orders.map(order => `
                            <tr>
                                <td>#${escapeHtml(order.id)}</td>
                                <td>${escapeHtml(userMap.get(String(order.userId))?.name || `Пользователь #${order.userId}`)}</td>
                                <td>${escapeHtml(getOrderProductNames(order))}</td>
                                <td><span class="dashboard-status">${escapeHtml(statusNames[order.status] || order.status)}</span></td>
                                <td>${formatPrice(order.total)}</td>
                                <td>
                                    <div class="dashboard-table__actions">
                                        <button class="dashboard-btn dashboard-btn--secondary" data-edit-order="${escapeHtml(order.id)}">Изменить</button>
                                        <button class="dashboard-btn dashboard-btn--danger" data-delete-order="${escapeHtml(order.id)}">Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('add-order').addEventListener('click', () => {
            openEntityDialog(
                'Новый заказ',
                orderFields(),
                { userId: state.users[0]?.id, status: 'new' },
                async payload => {
                    const allOrders = await api.get('orders');
                    await api.post('orders', {
                        id: api.nextId(allOrders),
                        ...normalizeOrderPayload(payload),
                        createdAt: new Date().toISOString()
                    });
                    api.showToast('Заказ создан');
                    await refreshCurrentTab();
                }
            );
        });
    }

    async function renderTab(tab) {
        state.currentTab = tab;
        tabs.querySelectorAll('.dashboard-tab').forEach(button => {
            button.classList.toggle('is-active', button.dataset.tab === tab);
        });
        setLoading();

        try {
            if (currentUser.role === 'admin') {
                if (tab === 'products') await renderAdminProducts();
                if (tab === 'users') await renderAdminUsers();
                if (tab === 'orders') await renderAdminOrders();
                return;
            }

            if (tab === 'profile') await renderProfile();
            if (tab === 'favorites') await renderFavorites();
            if (tab === 'cart') await renderCart();
            if (tab === 'orders') await renderClientOrders();
        } catch (error) {
            showError(error);
            content.innerHTML = renderEmpty('Не удалось загрузить данные. Проверьте, что JSON Server запущен.');
        }
    }

    tabs.addEventListener('click', event => {
        const button = event.target.closest('[data-tab]');
        if (button) renderTab(button.dataset.tab);
    });

    content.addEventListener('click', async event => {
        try {
            const addCartButton = event.target.closest('[data-add-cart]');
            if (addCartButton) {
                await addProductToCart(addCartButton.dataset.addCart);
                return;
            }

            const removeFavoriteButton = event.target.closest('[data-remove-favorite]');
            if (removeFavoriteButton) {
                await api.remove(`favorites/${removeFavoriteButton.dataset.removeFavorite}`);
                api.showToast('Товар удален из избранного');
                await renderFavorites();
                return;
            }

            const removeCartButton = event.target.closest('[data-remove-cart]');
            if (removeCartButton) {
                await api.remove(`cartItems/${removeCartButton.dataset.removeCart}`);
                api.showToast('Товар удален из корзины');
                await renderCart();
                return;
            }

            if (event.target.closest('#create-order')) {
                await createOrderFromCart();
                return;
            }

            const cancelOrderButton = event.target.closest('[data-cancel-order]');
            if (cancelOrderButton && !cancelOrderButton.disabled) {
                if (window.confirm('Отменить этот заказ?')) {
                    await api.remove(`orders/${cancelOrderButton.dataset.cancelOrder}`);
                    api.showToast('Заказ отменен');
                    await refreshCurrentTab();
                }
                return;
            }

            const editProductButton = event.target.closest('[data-edit-product]');
            if (editProductButton) {
                const product = state.products.find(item => String(item.id) === editProductButton.dataset.editProduct);
                openEntityDialog('Редактирование товара', productFields(), product, async payload => {
                    await api.put(`products/${product.id}`, {
                        ...product,
                        ...payload,
                        id: String(product.id),
                        price: Number(payload.price)
                    });
                    api.showToast('Товар обновлен');
                    await refreshCurrentTab();
                });
                return;
            }

            const deleteProductButton = event.target.closest('[data-delete-product]');
            if (deleteProductButton && window.confirm('Удалить товар и связанные записи?')) {
                const productId = deleteProductButton.dataset.deleteProduct;
                const [allFavorites, allCartItems] = await Promise.all([
                    api.get('favorites'),
                    api.get('cartItems')
                ]);
                const favorites = allFavorites.filter(item => String(item.productId) === String(productId));
                const cartItems = allCartItems.filter(item => String(item.productId) === String(productId));
                await Promise.all([
                    ...favorites.map(item => api.remove(`favorites/${item.id}`)),
                    ...cartItems.map(item => api.remove(`cartItems/${item.id}`))
                ]);
                await api.remove(`products/${productId}`);
                api.showToast('Товар удален');
                await refreshCurrentTab();
                return;
            }

            const editUserButton = event.target.closest('[data-edit-user]');
            if (editUserButton) {
                const user = state.users.find(item => String(item.id) === editUserButton.dataset.editUser);
                openEntityDialog('Редактирование пользователя', userFields(false), user, async payload => {
                    const updated = await api.patch(`users/${user.id}`, payload);
                    if (String(user.id) === String(currentUser.id)) {
                        api.setCurrentUser(updated);
                        Object.assign(currentUser, updated);
                        renderUserHeader();
                    }
                    api.showToast('Пользователь обновлен');
                    await refreshCurrentTab();
                });
                return;
            }

            const deleteUserButton = event.target.closest('[data-delete-user]');
            if (deleteUserButton && !deleteUserButton.disabled && window.confirm('Удалить пользователя и его данные?')) {
                const userId = deleteUserButton.dataset.deleteUser;
                const [allFavorites, allCartItems, allOrders] = await Promise.all([
                    api.get('favorites'),
                    api.get('cartItems'),
                    api.get('orders')
                ]);
                const favorites = allFavorites.filter(item => String(item.userId) === String(userId));
                const cartItems = allCartItems.filter(item => String(item.userId) === String(userId));
                const orders = allOrders.filter(item => String(item.userId) === String(userId));
                await Promise.all([
                    ...favorites.map(item => api.remove(`favorites/${item.id}`)),
                    ...cartItems.map(item => api.remove(`cartItems/${item.id}`)),
                    ...orders.map(item => api.remove(`orders/${item.id}`))
                ]);
                await api.remove(`users/${userId}`);
                api.showToast('Пользователь удален');
                await refreshCurrentTab();
                return;
            }

            const editOrderButton = event.target.closest('[data-edit-order]');
            if (editOrderButton) {
                const order = state.orders.find(item => String(item.id) === editOrderButton.dataset.editOrder);
                openEntityDialog(
                    'Редактирование заказа',
                    orderFields(),
                    { ...order, productIds: (order.productIds || []).join(', ') },
                    async payload => {
                        await api.put(`orders/${order.id}`, {
                            ...order,
                            ...normalizeOrderPayload(payload),
                            id: String(order.id)
                        });
                        api.showToast('Заказ обновлен');
                        await refreshCurrentTab();
                    }
                );
                return;
            }

            const deleteOrderButton = event.target.closest('[data-delete-order]');
            if (deleteOrderButton && window.confirm('Удалить заказ?')) {
                await api.remove(`orders/${deleteOrderButton.dataset.deleteOrder}`);
                api.showToast('Заказ удален');
                await refreshCurrentTab();
            }
        } catch (error) {
            showError(error);
        }
    });

    content.addEventListener('change', async event => {
        const quantityInput = event.target.closest('[data-cart-quantity]');
        if (!quantityInput) return;
        try {
            await api.patch(`cartItems/${quantityInput.dataset.cartQuantity}`, {
                quantity: Math.max(1, Number(quantityInput.value) || 1)
            });
            api.showToast('Количество обновлено');
            await renderCart();
        } catch (error) {
            showError(error);
        }
    });

    entityForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (event.submitter?.value === 'cancel') {
            dialog.close();
            return;
        }
        if (!entityForm.reportValidity() || !state.dialogSubmit) return;

        const saveButton = document.getElementById('entity-save');
        saveButton.disabled = true;
        try {
            await state.dialogSubmit(getFormPayload());
            dialog.close();
        } catch (error) {
            showError(error);
        } finally {
            saveButton.disabled = false;
        }
    });

    document.getElementById('dashboard-logout').addEventListener('click', api.logout);
    document.getElementById('dashboard-settings').addEventListener('click', () => {
        document.getElementById('burger-btn')?.click();
    });

    renderUserHeader();
    createTabs();
    loadReferenceData()
        .then(() => renderTab(state.currentTab))
        .catch(error => {
            showError(error);
            content.innerHTML = renderEmpty('JSON Server недоступен. Запустите его на порту 3000.');
        });
});
