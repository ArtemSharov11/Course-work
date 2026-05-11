const burgerBtn = document.getElementById('burger-btn');
const closeBtn = document.getElementById('close-btn');
const mobileMenu = document.getElementById('mobile-menu');

burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('is-open');
    burgerBtn.classList.add('is-active');
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    burgerBtn.classList.remove('is-active');
});


document.addEventListener('DOMContentLoaded', () => {
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');

    dropdownTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        dropdownMenu.classList.toggle('is-active');
    });

    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !dropdownTrigger.contains(e.target)) {
            dropdownMenu.classList.remove('is-active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdownMenu.classList.remove('is-active');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const catalogGrid = document.getElementById('catalog-grid');
    const catalogSection = document.querySelector('.catalog-section');

    if (loadMoreBtn && catalogGrid) {
        const initialCardsHTML = catalogGrid.innerHTML;
        let isExpanded = false; 

        loadMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {          
                catalogGrid.innerHTML += initialCardsHTML;
                loadMoreBtn.textContent = 'СВЕРНУТЬ';
                isExpanded = true;
                
            } else {          
                catalogGrid.innerHTML = initialCardsHTML;
                loadMoreBtn.textContent = 'СМОТРЕТЬ ЕЩЕ';
                isExpanded = false;
                catalogSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});


let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlides(n) {
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.process-step');

    steps.forEach(step => {
        step.addEventListener('click', () => {
            // Если хочешь, чтобы открыт был только один — раскомментируй строку ниже:
            // steps.forEach(s => s.classList.remove('is-active'));
            
            step.classList.toggle('is-active');
        });
    });
});