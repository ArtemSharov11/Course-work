document.addEventListener('DOMContentLoaded', function() {

    // 1. УНИВЕРСАЛЬНЫЕ МОДАЛЬНЫЕ ОКНА (ВЫЕЗД СПРАВА)
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden'; // Запрет скролла сайта
        }
    };

    const closeModal = (modalElement) => {
        modalElement.classList.remove('is-open');
        document.body.style.overflow = ''; // Возврат скролла
    };

    // Слушаем клики на кнопки открытия
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-modal]');
        if (trigger) {
            e.preventDefault();
            const id = trigger.getAttribute('data-open-modal');
            openModal(id);
        }
    });

    // Закрытие (на крестик или фон)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close-btn') || e.target.classList.contains('modal-drawer__overlay')) {
            const activeModal = e.target.closest('.modal-drawer');
            closeModal(activeModal);
        }
    });

    // Переключатель "Дополнительно" внутри модалки
    const extraTrigger = document.getElementById('toggle-extra');
    const extraFields = document.getElementById('extra-fields');
    if (extraTrigger && extraFields) {
        extraTrigger.addEventListener('click', () => {
            const isOpen = extraFields.style.display === 'block';
            extraFields.style.display = isOpen ? 'none' : 'block';
            extraTrigger.textContent = isOpen ? 'ДОПОЛНИТЕЛЬНО +' : 'СКРЫТЬ -';
        });
    }


    // 2. БУРГЕР-МЕНЮ
    const burgerButton = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-btn');

    if (burgerButton && mobileMenu) {
        burgerButton.addEventListener('click', () => {
            mobileMenu.classList.add('is-open');
            burgerButton.classList.add('is-active');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            burgerButton.classList.remove('is-active');
        });
    }

    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            const link = e.target.closest('.mobile-nav a, .mobile-btn');
            if (!link) return;

            mobileMenu.classList.remove('is-open');
            if (burgerButton) burgerButton.classList.remove('is-active');
        });
    }


    // 3. DROPDOWN (ВЫПАДАЮЩЕЕ МЕНЮ)
    const dropTrigger = document.getElementById('dropdown-trigger');
    const dropMenu = document.getElementById('dropdown-menu');

    if (dropTrigger && dropMenu) {
        dropTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropMenu.classList.toggle('is-active');
        });

        document.addEventListener('click', (e) => {
            if (!dropMenu.contains(e.target) && !dropTrigger.contains(e.target)) {
                dropMenu.classList.remove('is-active');
            }
        });
    }


    // 4. АККОРДЕОН И ПУСТЫЕ ССЫЛКИ
    document.querySelectorAll('.process-step').forEach(step => {
        step.addEventListener('click', () => step.classList.toggle('is-active'));
    });

    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => e.preventDefault());
    });

    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slider-container .slide');
    if (slider && slides.length > 1) {
        const prevButton = slider.querySelector('.slider-prev');
        const nextButton = slider.querySelector('.slider-next');
        const dots = slider.querySelectorAll('.dot');
        let activeSlide = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        if (activeSlide < 0) activeSlide = 0;
        let autoplayId;

        const showSlide = index => {
            activeSlide = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('active', slideIndex === activeSlide);
            });
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('active', dotIndex === activeSlide);
            });
        };

        const startAutoplay = () => {
            clearInterval(autoplayId);
            autoplayId = setInterval(() => showSlide(activeSlide + 1), 4500);
        };

        prevButton?.addEventListener('click', () => {
            showSlide(activeSlide - 1);
            startAutoplay();
        });

        nextButton?.addEventListener('click', () => {
            showSlide(activeSlide + 1);
            startAutoplay();
        });

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                showSlide(dotIndex);
                startAutoplay();
            });
        });

        showSlide(activeSlide);
        startAutoplay();
    }
});

// 5. ПРЕЛОАДЕР
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
            setTimeout(() => preloader.remove(), 700);
        }, 600);
    }
});
