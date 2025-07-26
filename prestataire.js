document.addEventListener("DOMContentLoaded", function () {
  // Le JSON des prestataires fourni
  let prestatairesData = [];

  fetch("prestataire.json")
    .then((response) => response.json())
    .then((data) => {
      // Si le fichier JSON est chargé, on utilise les données du fichier
      prestatairesData = data;
      populateSecteurFilter();
      displayPrestataires(prestatairesData);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du fichier JSON:", error);
      // En cas d'erreur, on utilise les données par défaut
      populateSecteurFilter();
      displayPrestataires(prestatairesData);
    });

  // Récupération des éléments du DOM
  const cardsContainer = document.getElementById("cardsContainer");
  const searchInput = document.getElementById("searchInput");
  const secteurSelect = document.getElementById("secteurSelect");
  const typeSelect = document.getElementById("typeSelect");
  const searchBtn = document.getElementById("searchBtn");
  const resultsCount = document.getElementById("resultsCount");
  const noResults = document.getElementById("noResults");

  // Éléments de la modale
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("closeModal");
  const modalImage = document.getElementById("modalImage");
  const modalNom = document.getElementById("modalNom");
  const modalType = document.getElementById("modalType");
  const modalSecteur = document.getElementById("modalSecteur");
  const modalCotation = document.getElementById("modalCotation");
  const modalBio = document.getElementById("modalBio");

  /**
   * Génère le HTML pour les étoiles de cotation.
   * @param {number} cotation - La note de 1 à 5.
   * @returns {string} Le HTML des étoiles.
   */
  function generateStars(cotation) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      starsHTML += `<span class="star ${
        i <= cotation ? "active" : ""
      }">&#9733;</span>`;
    }
    return starsHTML;
  }

  /**
   * Affiche les cartes des prestataires dans le conteneur.
   * @param {Array} prestataires - La liste des prestataires à afficher.
   */
  function displayPrestataires(prestataires) {
    cardsContainer.innerHTML = ""; // Vide le conteneur

    if (prestataires.length === 0) {
      noResults.classList.remove("hidden");
      resultsCount.textContent =
        "Aucun profil ne correspond à votre recherche.";
    } else {
      noResults.classList.add("hidden");
      resultsCount.textContent = `Affichage de ${prestataires.length} profil(s) sur ${prestatairesData.length}.`;
    }

    prestataires.forEach((prestataire, index) => {
      const originalIndex = prestatairesData.findIndex(
        (p) => p.nom === prestataire.nom && p.bio === prestataire.bio
      );

      const card = document.createElement("article");
      card.className = "card";
      // Ajoute un data-attribute pour retrouver facilement le prestataire dans le tableau original
      card.dataset.index = originalIndex;

      card.innerHTML = `
                <div class="card__header">
                    <img src="${prestataire.image}" alt="Photo de ${
        prestataire.nom
      }" class="card__image">
                </div>
                <div class="card__body">
                    <h3 class="card__name">${prestataire.nom}</h3>
                    <span class="card__sector">${prestataire.secteur}</span>
                    <p class="card__type">${
                      prestataire.type === "entreprise"
                        ? "Entreprise"
                        : "Prestataire"
                    }</p>
                    <div class="card__rating">
                        ${generateStars(prestataire.cotation)}
                    </div>
                </div>
            `;
      cardsContainer.appendChild(card);
    });
  }

  /**
   * Remplit le menu déroulant des secteurs avec des valeurs uniques.
   */
  function populateSecteurFilter() {
    const secteurs = [...new Set(prestatairesData.map((p) => p.secteur))];
    secteurs.sort(); // Trie les secteurs par ordre alphabétique
    secteurs.forEach((secteur) => {
      const option = document.createElement("option");
      option.value = secteur;
      option.textContent = secteur;
      secteurSelect.appendChild(option);
    });
  }

  /**
   * Filtre et affiche les prestataires en fonction des critères actuels.
   */
  function handleFilterAndSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const secteurValue = secteurSelect.value;
    const typeValue = typeSelect.value;

    const filteredPrestataires = prestatairesData.filter((p) => {
      const matchesSearch =
        p.nom.toLowerCase().includes(searchTerm) ||
        p.bio.toLowerCase().includes(searchTerm);
      const matchesSecteur = !secteurValue || p.secteur === secteurValue;
      const matchesType = !typeValue || p.type === typeValue;
      return matchesSearch && matchesSecteur && matchesType;
    });

    displayPrestataires(filteredPrestataires);
  }

  /**
   * Ouvre et remplit la modale avec les informations d'un prestataire.
   * @param {object} prestataire - L'objet du prestataire à afficher.
   */
  function openModal(prestataire) {
    modalImage.src = prestataire.image;
    modalImage.alt = `Photo de ${prestataire.nom}`;
    modalNom.textContent = prestataire.nom;
    modalType.textContent =
      prestataire.type === "entreprise" ? "Entreprise" : "Prestataire";
    modalSecteur.textContent = prestataire.secteur;
    modalCotation.innerHTML = generateStars(prestataire.cotation);
    modalBio.textContent = prestataire.bio;
    modal.classList.remove("hidden");
    const whatsappBtn = document.getElementById("whatsappBtn");
    const numeroWhatsApp = "243851208563"; // <<<<< À modifier par ton numéro réel

    const message = `Bonjour, je suis intéressé par le profil ${
      prestataire.nom
    } (${
      prestataire.type === "entreprise" ? "Entreprise" : "Prestataire"
    }) dans le secteur ${prestataire.secteur}.`;

    whatsappBtn.onclick = () => {
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    };
  }

  /**
   * Ferme la modale.
   */
  function closeModal() {
    modal.classList.add("hidden");
  }

  // --- Écouteurs d'événements ---

  // Filtres
  searchBtn.addEventListener("click", handleFilterAndSearch);
  searchInput.addEventListener("keyup", handleFilterAndSearch);
  secteurSelect.addEventListener("change", handleFilterAndSearch);
  typeSelect.addEventListener("change", handleFilterAndSearch);

  // Modale
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    // Ferme la modale si on clique sur le fond (l'overlay)
    if (e.target === modal) {
      closeModal();
    }
  });

  // Clic sur une carte pour ouvrir la modale (délégation d'événement)
  cardsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) {
      const index = card.dataset.index;
      openModal(prestatairesData[index]);
    }
  });

  // --- Initialisation de la page ---
  populateSecteurFilter();
  displayPrestataires(prestatairesData);
});
