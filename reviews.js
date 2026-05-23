document.addEventListener('DOMContentLoaded', () => {
    const showMoreBtns = document.querySelectorAll('.btn-show-more');

    showMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.review-card__text-container');
            
            container.classList.toggle('active');

            if (container.classList.contains('active')) {
                btn.textContent = 'СКРЫТЬ';
            } else {
                btn.textContent = 'ЕЩЕ';
            }
        });
    });
});