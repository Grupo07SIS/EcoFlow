document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    let currentIndex = 0;

    function showNextScreen() {
        if (currentIndex < screens.length - 1) {
            screens[currentIndex].classList.remove('active');
            currentIndex++;
            screens[currentIndex].classList.add('active');
        }
    }

    // Inicia a transição após 3 segundos
    setTimeout(showNextScreen, 3000);
});
