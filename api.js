(() => {
    const API_BASE = 'http://localhost:3000';

    async function request(endpoint, options = {}) {
        const response = await fetch(`${API_BASE}/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            let message = `Ошибка сервера: ${response.status}`;
            try {
                const payload = await response.json();
                message = payload.message || message;
            } catch {
            }
            throw new Error(message);
        }

        if (response.status === 204) return null;
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser')) || null;
        } catch {
            localStorage.removeItem('currentUser');
            return null;
        }
    }

    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    function requireUser(role) {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return null;
        }
        if (role && user.role !== role) {
            window.location.href = 'dashboard.html';
            return null;
        }
        return user;
    }

    function nextId(items) {
        const numericIds = items
            .map(item => Number(item.id))
            .filter(Number.isFinite);
        return String((numericIds.length ? Math.max(...numericIds) : 0) + 1);
    }

    function showToast(message, type = 'success') {
        let container = document.querySelector('.app-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'app-toast-container';
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `app-toast app-toast--${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('is-visible'));
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }

    window.NeffApi = {
        baseUrl: API_BASE,
        get: endpoint => request(endpoint),
        post: (endpoint, data) => request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        put: (endpoint, data) => request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        patch: (endpoint, data) => request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
        remove: endpoint => request(endpoint, { method: 'DELETE' }),
        getCurrentUser,
        setCurrentUser,
        requireUser,
        logout,
        nextId,
        showToast
    };
})();
