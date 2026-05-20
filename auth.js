document.addEventListener('DOMContentLoaded', () => {
    function showError(input, message) {
        const wrapper = input.closest('.input-wrapper');
        if (!wrapper) return;
        const errorSpan = wrapper.querySelector('.error-msg');
        input.classList.add('error');
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
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

        let nickGenAttempts = 0;
        const adjectives = ["Cool", "Dark", "Fast", "Smart", "Brave"];
        const nouns = ["Tiger", "Eagle", "Shark", "Wolf", "Bear"];

        function generateNickname() {
            if (nickGenAttempts >= 5) {
                nickInput.readOnly = false;
                nickInput.value = "";
                nickInput.placeholder = "Введите никнейм вручную";
                btnGenNick.style.display = "none";
                return;
            }
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const num = Math.floor(Math.random() * 1000);
            nickInput.value = `${adj}${noun}${num}`;
            nickGenAttempts++;
            validateForm();
        }

        btnGenNick.addEventListener('click', generateNickname);
        generateNickname();

        passConfirmInput.addEventListener('paste', (e) => {
            e.preventDefault();
            showError(passConfirmInput, "Вставка пароля запрещена методичкой!");
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
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if (age < 16) {
                    showError(dobInput, "Вам должно быть полных 16 лет.");
                    isValid = false;
                }
            } else { isValid = false; }

            const phoneRegex = /^\+375\d{9}$/;
            if (!phoneRegex.test(phoneInput.value.replace(/\s|-|\(|\)/g, ''))) {
                isValid = false;
                if(phoneInput.value.length > 4) showError(phoneInput, "Формат: +375 (XX) XXX-XX-XX");
            }

            const top100Passwords = ["12345678", "password", "qwerty1234", "admin123"]; 
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            
            if (passInput.value) {
                if (top100Passwords.includes(passInput.value)) {
                    showError(passInput, "Этот пароль слишком популярный. Придумайте другой.");
                    isValid = false;
                } else if (!passRegex.test(passInput.value)) {
                    showError(passInput, "От 8 до 20 симв., 1 заглавная, 1 строчная, 1 цифра, 1 спецсимвол.");
                    isValid = false;
                }
            } else { isValid = false; }

            if (passConfirmInput.value && passConfirmInput.value !== passInput.value) {
                showError(passConfirmInput, "Пароли не совпадают!");
                isValid = false;
            } else if (!passConfirmInput.value) {
                isValid = false;
            }

            if (!nameInput.value.trim() || !emailInput.value.includes('@') || !nickInput.value.trim() || !agreeCheckbox.checked) {
                isValid = false;
            }

            if (isValid) {
                btnRegister.disabled = false;
                btnRegister.style.opacity = '1';
                btnRegister.style.cursor = 'pointer';
            } else {
                btnRegister.disabled = true;
                btnRegister.style.opacity = '0.5';
                btnRegister.style.cursor = 'not-allowed';
            }

            return isValid;
        }

        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) return;

            const newUser = {
                id: Date.now().toString(),
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                dob: dobInput.value,
                nickname: nickInput.value,
                password: passInput.value,
                role: "клиент"
            };

            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    window.location.href = 'index.html';
                } else {
                    console.error('Ошибка при сохранении');
                }
            } catch (error) {
                console.error('Ошибка:', error);
            }
        });
    }
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');
            const email = emailInput.value;
            const password = passInput.value;

            hideError(emailInput);
            hideError(passInput);

            try {
                const response = await fetch(`http://localhost:3000/users?email=${email}`);
                const users = await response.json();

                if (users.length === 0) {
                    showError(emailInput, "Пользователь с таким email не найден");
                    return;
                }

                const user = users[0];

                if (user.password !== password) {
                    showError(passInput, "Неверный пароль");
                    return;
                }

                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';

            } catch (error) {
                console.error("Ошибка при авторизации:", error);
            }
        });
        
        document.getElementById('login-email').addEventListener('input', function() { hideError(this); });
        document.getElementById('login-password').addEventListener('input', function() { hideError(this); });
    }
});