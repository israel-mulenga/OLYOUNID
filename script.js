document.addEventListener("DOMContentLoaded", function () {
  // ======== GESTION DU MENU MOBILE ========
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");

  // Fonction pour afficher/cacher le menu
  const toggleMenu = () => {
    navMenu.classList.toggle("show-menu");
    // Change l'icône burger en croix et vice-versa
    if (navMenu.classList.contains("show-menu")) {
      navToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  };

  // Écouteur d'événement sur le bouton toggle
  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  // Fonction pour fermer le menu quand un lien est cliqué
  const closeMenu = () => {
    if (navMenu.classList.contains("show-menu")) {
      toggleMenu();
    }
  };

  // Ajoute un écouteur d'événement à chaque lien du menu
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ======== ANIMATION D'APPARITION AU DÉFILEMENT ========
  const sections = document.querySelectorAll(".section");

  const revealSection = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    entry.target.style.opacity = 1;
    entry.target.style.transform = "translateY(0)";

    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  sections.forEach((section) => {
    sectionObserver.observe(section);
    // Prépare la section pour l'animation
    section.style.opacity = 0;
    section.style.transform = "translateY(50px)";
    section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  });
  // La section hero est visible dès le début, pas besoin d'animation
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    heroSection.style.opacity = 1;
    heroSection.style.transform = "translateY(0)";
  }
});
