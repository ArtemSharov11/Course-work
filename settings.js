document.addEventListener('DOMContentLoaded', () => {
    const themeCheckbox = document.getElementById('theme-checkbox');
    const impairedBtn = document.getElementById('impaired-toggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        themeCheckbox.checked = true;
    }

    if (localStorage.getItem('impaired') === 'on') {
        body.classList.add('visually-impaired');
    }

    themeCheckbox.addEventListener('change', () => {
        if (themeCheckbox.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    impairedBtn.addEventListener('click', () => {
        body.classList.toggle('visually-impaired');
        const state = body.classList.contains('visually-impaired') ? 'on' : 'off';
        localStorage.setItem('impaired', state);
    });
    const authLinks = document.querySelectorAll('.auth-nav-link');
    const currentUserStr = localStorage.getItem('currentUser');

    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        
        authLinks.forEach(link => {
            link.textContent = `ВЫЙТИ (${currentUser.nickname})`;
            link.href = "#";
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        });
    } else {
        authLinks.forEach(link => {
            link.textContent = "ВОЙТИ";
            link.href = "login.html";
        });
    }
});