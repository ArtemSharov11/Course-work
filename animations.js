document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. БУРГЕР-МЕНЮ (ДЛЯ МОБИЛЬНОЙ ВЕРСИИ)
    // ==========================================
    const burgerButton = document.getElementById('burger-btn');
    const closeButton = document.getElementById('close-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu');

    // Если на странице есть кнопка бургера и само меню
    if (burgerButton && mobileMenuOverlay) {
        burgerButton.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('is-open');
            burgerButton.classList.add('is-active');
        });
    }

    // Если на странице есть кнопка закрытия
    if (closeButton && mobileMenuOverlay) {
        closeButton.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('is-open');
            // Убираем анимацию крестика у кнопки бургера, если она есть
            if (burgerButton) {
                burgerButton.classList.remove('is-active');
            }
        });
    }


    // ==========================================
    // 2. ВЫПАДАЮЩЕЕ МЕНЮ В ШАПКЕ (КАТАЛОГ)
    // ==========================================
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (dropdownTrigger && dropdownMenu) {
        dropdownTrigger.addEventListener('click', function(event) {
            event.preventDefault(); // Чтобы страница не прыгала вверх
            event.stopPropagation(); // Чтобы клик не уходил дальше
            
            dropdownMenu.classList.toggle('is-active');
        });

        // Закрытие меню при клике в любое другое место экрана
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = dropdownMenu.contains(event.target);
            const isClickOnTrigger = dropdownTrigger.contains(event.target);

            if (!isClickInsideMenu && !isClickOnTrigger) {
                dropdownMenu.classList.remove('is-active');
            }
        });

        // Закрытие меню при нажатии на клавишу Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                dropdownMenu.classList.remove('is-active');
            }
        });
    }


    // ==========================================
    // 3. АККОРДЕОН (СЕКЦИЯ "ПРОЦЕСС" НА ГЛАВНОЙ)
    // ==========================================
    const processSteps = document.querySelectorAll('.process-step');

    if (processSteps.length > 0) {
        processSteps.forEach(function(step) {
            step.addEventListener('click', function() {
                // Если хочешь, чтобы при открытии одного шага другой закрывался,
                // раскомментируй строки ниже:
                /*
                processSteps.forEach(function(item) {
                    item.classList.remove('is-active');
                });
                */
                step.classList.toggle('is-active');
            });
        });
    }


    // ==========================================
    // 4. ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА
    // ==========================================
    const allSlides = document.querySelectorAll('.slide');
    if (allSlides.length > 0) {
        // Показываем самый первый слайд при загрузке
        showSlides(slideIndex);
    }
});


// ==========================================
// 5. ЛОГИКА СЛАЙДЕРА (ГЛОБАЛЬНЫЕ ФУНКЦИИ)
// Эти функции вынесены из DOMContentLoaded, чтобы 
// атрибуты onclick="changeSlide(1)" в HTML могли их найти.
// ==========================================
let slideIndex = 0;

function showSlides(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Если на этой странице нет слайдов, ничего не делаем
    if (slides.length === 0) {
        return;
    }

    // Если номер слайда больше количества слайдов — переходим к первому
    if (index >= slides.length) {
        slideIndex = 0;
    }
    // Если номер меньше нуля — переходим к последнему
    if (index < 0) {
        slideIndex = slides.length - 1;
    }

    // Скрываем все слайды
    slides.forEach(function(slide) {
        slide.classList.remove('active');
    });

    // Убираем активный класс у всех точек
    dots.forEach(function(dot) {
        dot.classList.remove('active');
    });

    // Показываем нужный слайд и активируем нужную точку
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
    }
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}

// Функция для кнопок "Вперед" и "Назад"
function changeSlide(step) {
    slideIndex = slideIndex + step;
    showSlides(slideIndex);
}

// Функция для клика по конкретной точке
function currentSlide(index) {
    slideIndex = index;
    showSlides(slideIndex);
}