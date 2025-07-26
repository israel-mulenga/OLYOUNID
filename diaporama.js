document.addEventListener('DOMContentLoaded', function () {

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let slideInterval;

    /**
     * Affiche une slide spécifique en gérant la classe 'active'.
     * @param {number} index - L'index de la slide à afficher.
     */
    function goToSlide(index) {
        // Met à jour l'index courant
        currentIndex = (index + slides.length) % slides.length;

        // Met à jour la classe 'active' pour les slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });

        // Met à jour la classe 'active' pour les points de navigation
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    /**
     * Passe à la slide suivante.
     */
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    /**
     * Revient à la slide précédente.
     */
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    /**
     * Démarre ou redémarre le défilement automatique.
     */
    function startSlideShow() {
        // Arrête l'intervalle précédent pour éviter les conflits
        clearInterval(slideInterval);
        // Définit un nouvel intervalle
        slideInterval = setInterval(nextSlide, 7000); // Change de slide toutes les 7 secondes
    }

    // --- Écouteurs d'événements ---

    if (prevBtn && nextBtn) {
        // Clic sur les flèches de navigation
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideShow(); // Redémarre le timer
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideShow(); // Redémarre le timer
        });
    }

    // Clic sur les points de navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index, 10);
            goToSlide(index);
            startSlideShow(); // Redémarre le timer
        });
    });

    // --- Initialisation ---
    if(slides.length > 0) {
        goToSlide(0); // Affiche la première slide au chargement
        startSlideShow(); // Démarre le diaporama automatique
    }
    
});