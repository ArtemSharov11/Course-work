document.addEventListener('DOMContentLoaded', function() {

    const burgerButton = document.getElementById('burger-btn');
    const closeButton = document.getElementById('close-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu');

    if (burgerButton && mobileMenuOverlay) {
        burgerButton.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('is-open');
            burgerButton.classList.add('is-active');
        });
    }

    if (closeButton && mobileMenuOverlay) {
        closeButton.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('is-open');
            if (burgerButton) {
                burgerButton.classList.remove('is-active');
            }
        });
    }

    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (dropdownTrigger && dropdownMenu) {
        dropdownTrigger.addEventListener('click', function(event) {
            event.preventDefault(); 
            event.stopPropagation(); 
            
            dropdownMenu.classList.toggle('is-active');
        });

        document.addEventListener('click', function(event) {
            const isClickInsideMenu = dropdownMenu.contains(event.target);
            const isClickOnTrigger = dropdownTrigger.contains(event.target);

            if (!isClickInsideMenu && !isClickOnTrigger) {
                dropdownMenu.classList.remove('is-active');
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                dropdownMenu.classList.remove('is-active');
            }
        });
    }

    const processSteps = document.querySelectorAll('.process-step');

    if (processSteps.length > 0) {
        processSteps.forEach(function(step) {
            step.addEventListener('click', function() {
                step.classList.toggle('is-active');
            });
        });
    }
    const allSlides = document.querySelectorAll('.slide');
    if (allSlides.length > 0) {
        showSlides(slideIndex);
    }
});

let slideIndex = 0;

function showSlides(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) {
        return;
    }

    if (index >= slides.length) {
        slideIndex = 0;
    }
    if (index < 0) {
        slideIndex = slides.length - 1;
    }

    slides.forEach(function(slide) {
        slide.classList.remove('active');
    });

    dots.forEach(function(dot) {
        dot.classList.remove('active');
    });

    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
    }
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}

function changeSlide(step) {
    slideIndex = slideIndex + step;
    showSlides(slideIndex);
}

function currentSlide(index) {
    slideIndex = index;
    showSlides(slideIndex);
}

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('hide');
        }, 800);
    }
});