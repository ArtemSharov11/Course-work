document.addEventListener('DOMContentLoaded', () => {
    const fallbackBadPasswords = [
        '123456',
        '123456789',
        '12345678',
        'password',
        'qwerty123',
        'qwerty1234',
        'qwerty',
        '111111',
        '12345',
        '1234567890'
    ];

    let badPasswords = fallbackBadPasswords;

    fetch('bad-passwords.json')
        .then(response => response.ok ? response.json() : fallbackBadPasswords)
        .then(passwords => {
            if (Array.isArray(passwords) && passwords.length >= 100) {
                badPasswords = passwords.map(password => String(password).toLowerCase());
            }
        })
        .catch(() => {
            badPasswords = fallbackBadPasswords;
        });

    function showError(input, message) {
        const wrapper = input.closest('.input-wrapper');
        if (!wrapper) return;
        const errorSpan = wrapper.querySelector('.error-msg');
        input.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
    }

    function hideError(input) {
        const wrapper = input.closest('.input-wrapper');
        if (!wrapper) return;
        const errorSpan = wrapper.querySelector('.error-msg');
        input.classList.remove('error');
        if (errorSpan) errorSpan.style.display = 'none';
    }

    const regForm = document.getElementById('register-form');

    if (regForm) {
        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        const phoneInput = document.getElementById('reg-phone');
        const dobInput = document.getElementById('reg-dob');
        const nickInput = document.getElementById('reg-nick');
        const passInput = document.getElementById('reg-password');
        const passConfirmInput = document.getElementById('reg-password-confirm');
        const agreeCheckbox = document.getElementById('reg-agreement');
        const btnRegister = document.getElementById('btn-register');
        const btnGenNick = document.getElementById('btn-gen-nick');
        const btnGenPassword = document.getElementById('btn-gen-password');
        const passwordModeInputs = document.querySelectorAll('input[name="password-mode"]');

        let nickGenAttempts = 0;
        const adjectives = ['Cool', 'Dark', 'Fast', 'Smart', 'Brave', 'Bright', 'Rapid', 'Silver'];
        const nouns = ['Tiger', 'Eagle', 'Shark', 'Wolf', 'Bear', 'Lion', 'Owl', 'Hawk'];
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

        function generateNickname() {
            if (nickGenAttempts >= 5) {
                nickInput.readOnly = false;
                nickInput.value = '';
                nickInput.placeholder = 'Введите никнейм вручную';
                btnGenNick.style.display = 'none';
                return;
            }

            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const num = Math.floor(Math.random() * 1000);
            nickInput.value = `${adj}${noun}${num}`;
            nickGenAttempts++;
            validateForm();
        }

        function generatePassword() {
            const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
            const lower = 'abcdefghijkmnopqrstuvwxyz';
            const digits = '23456789';
            const specials = '@$!%*?&';
            const all = upper + lower + digits + specials;

            let password = [
                upper[Math.floor(Math.random() * upper.length)],
                lower[Math.floor(Math.random() * lower.length)],
                digits[Math.floor(Math.random() * digits.length)],
                specials[Math.floor(Math.random() * specials.length)]
            ];

            while (password.length < 12) {
                password.push(all[Math.floor(Math.random() * all.length)]);
            }

            password = password.sort(() => Math.random() - 0.5).join('');

            if (badPasswords.includes(password.toLowerCase()) || !passRegex.test(password)) {
                return generatePassword();
            }

            return password;
        }

        function getPasswordMode() {
            return document.querySelector('input[name="password-mode"]:checked')?.value || 'manual';
        }

        function applyPasswordMode() {
            const isAuto = getPasswordMode() === 'auto';
            passInput.readOnly = isAuto;
            passConfirmInput.readOnly = isAuto;
            btnGenPassword.hidden = !isAuto;

            if (isAuto) {
                const password = generatePassword();
                passInput.type = 'text';
                passConfirmInput.type = 'text';
                passInput.value = password;
                passConfirmInput.value = password;
                hideError(passInput);
                hideError(passConfirmInput);
            } else {
                passInput.type = 'password';
                passConfirmInput.type = 'password';
                passInput.value = '';
                passConfirmInput.value = '';
            }

            validateForm();
        }

        btnGenNick.addEventListener('click', generateNickname);
        generateNickname();

        btnGenPassword.addEventListener('click', () => {
            const password = generatePassword();
            passInput.value = password;
            passConfirmInput.value = password;
            hideError(passInput);
            hideError(passConfirmInput);
            validateForm();
        });

        passwordModeInputs.forEach(input => {
            input.addEventListener('change', applyPasswordMode);
        });

        passConfirmInput.addEventListener('paste', event => {
            event.preventDefault();
            showError(passConfirmInput, 'Вставка пароля запрещена');
        });

        const allInputs = [nameInput, emailInput, phoneInput, dobInput, nickInput, passInput, passConfirmInput];
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                hideError(input);
                validateForm();
            });
        });

        agreeCheckbox.addEventListener('change', validateForm);

        function validateForm() {
            let isValid = true;

            if (dobInput.value) {
                const birthDate = new Date(dobInput.value);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 16) {
                    showError(dobInput, 'Вам должно быть полных 16 лет.');
                    isValid = false;
                }
            } else {
                isValid = false;
            }

            const phoneRegex = /^\+375\d{9}$/;
            if (!phoneRegex.test(phoneInput.value.replace(/\s|-|\(|\)/g, ''))) {
                isValid = false;
                if (phoneInput.value.length > 4) {
                    showError(phoneInput, 'Формат: +375 (XX) XXX-XX-XX');
                }
            }

            const passwordValue = passInput.value;
            if (passwordValue) {
                if (badPasswords.includes(passwordValue.toLowerCase())) {
                    showError(passInput, 'Этот пароль входит в TOP-100 популярных. Придумайте другой.');
                    isValid = false;
                } else if (!passRegex.test(passwordValue)) {
                    showError(passInput, 'От 8 до 20 символов: заглавная, строчная, цифра и спецсимвол.');
                    isValid = false;
                }
            } else {
                isValid = false;
            }

            if (passConfirmInput.value && passConfirmInput.value !== passwordValue) {
                showError(passConfirmInput, 'Пароли не совпадают!');
                isValid = false;
            } else if (!passConfirmInput.value) {
                isValid = false;
            }

            if (!nameInput.value.trim() || !emailInput.value.includes('@') || !nickInput.value.trim() || !agreeCheckbox.checked) {
                isValid = false;
            }

            btnRegister.disabled = !isValid;
            btnRegister.style.opacity = isValid ? '1' : '0.5';
            btnRegister.style.cursor = isValid ? 'pointer' : 'not-allowed';

            return isValid;
        }

        regForm.addEventListener('submit', async event => {
            event.preventDefault();

            if (!validateForm()) return;

            const newUser = {
                id: Date.now().toString(),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                dob: dobInput.value,
                nickname: nickInput.value.trim(),
                password: passInput.value,
                role: 'client'
            };

            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    const savedUser = await response.json();
                    localStorage.setItem('currentUser', JSON.stringify(savedUser));
                    window.location.href = 'dashboard.html';
                } else {
                    console.error('Ошибка при сохранении пользователя');
                }
            } catch (error) {
                console.error('Ошибка регистрации:', error);
            }
        });
    }

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async event => {
            event.preventDefault();

            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');
            const email = emailInput.value;
            const password = passInput.value;

            hideError(emailInput);
            hideError(passInput);

            try {
                const response = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
                const users = await response.json();

                if (users.length === 0) {
                    showError(emailInput, 'Пользователь с таким email не найден');
                    return;
                }

                const user = users[0];

                if (user.password !== password) {
                    showError(passInput, 'Неверный пароль');
                    return;
                }

                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Ошибка при авторизации:', error);
            }
        });

        document.getElementById('login-email').addEventListener('input', function () {
            hideError(this);
        });
        document.getElementById('login-password').addEventListener('input', function () {
            hideError(this);
        });
    }
});
