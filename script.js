// ------------------------------ MOBILE MENU - NAVBAR ------------------------------

const menuToggle = document.querySelector(".header__menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const closeButton = document.querySelector(".mobile-menu-close");
const overlay = document.querySelector(".overlay");
const menuLinks = document.querySelectorAll(".menu__item");
const menuMobileLinks = document.querySelectorAll(".mobile-menu__item");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeButton.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

menuMobileLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    const targetId = link.getAttribute("data-href");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      const offset = window.innerHeight * 0.1;

      window.scrollTo({
        top: targetSection.offsetTop - offset,
        behavior: "smooth",
      });
    }
    document.body.style.overflow = "auto";

    menuMobileLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    // Po kliknięciu w link, zamykamy menu
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});

menuLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(link);
    const targetId = link.getAttribute("data-href");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      const offset = window.innerHeight * 0.1;

      window.scrollTo({
        top: targetSection.offsetTop - offset,
        behavior: "smooth",
      });
    }

    menuLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// ------------------------------ SLIDER FUNCTIONALITY ------------------------------
const sliderTrack = document.getElementById("slider-track");
const nextBtn = document.querySelector(".slider-btn.next");
const prevBtn = document.querySelector(".slider-btn.prev");

let featuredProducts = [];
let slideWidth = 320;
let productsDuplicated = [];

// Fetch i render
fetch("data/featuredProducts.json")
  .then((res) => res.json())
  .then((data) => {
    featuredProducts = data;
    productsDuplicated = [...data, ...data]; // Dublowanie tablicy
    renderSlides();
    updateButtons();
  });

function renderSlides() {
  sliderTrack.innerHTML = "";

  productsDuplicated.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    let label = "";
    if (product.label === "BESTSELLER") {
      label = '<div class="badge bestsellers">BESTSELLER</div>';
    } else if (product.label === "LIMITED EDITION") {
      label = '<div class="badge limited-editions">LIMITED EDITION</div>';
    }

    card.innerHTML = `
      ${label}
      <div class="heart-icon"></div>
      <img class="product-image" src="${product.image}" alt="${product.title}" />
      <div class="product-title">${product.title}</div>
      <div class="product-price">${product.price}</div>
    `;
    sliderTrack.appendChild(card);
  });
}

sliderTrack.addEventListener("scroll", () => {
  if (
    sliderTrack.scrollLeft + sliderTrack.clientWidth >=
    sliderTrack.scrollWidth - 10
  ) {
    addMoreProducts();
  }

  updateButtons();
});

function addMoreProducts() {
  productsDuplicated.push(...featuredProducts); // Można tu dodać np. dane z API
  renderSlides();
}

nextBtn.addEventListener("click", () => {
  sliderTrack.scrollBy({ left: slideWidth, behavior: "smooth" });
});

prevBtn.addEventListener("click", () => {
  sliderTrack.scrollBy({ left: -slideWidth, behavior: "smooth" });
});

function updateButtons() {
  const maxScrollLeft = sliderTrack.scrollWidth - sliderTrack.clientWidth;
  const currentScroll = sliderTrack.scrollLeft;

  if (currentScroll <= 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
  }

  if (currentScroll >= maxScrollLeft - 5) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "block";
  }
}
// ------------------------------ Products  ------------------------------
const productSelect = document.getElementById("products-per-page");
const productGrid = document.getElementById("productGrid");

let currentPage = 1;
let productsPerPage = parseInt(document.querySelector(".selected-value").textContent) || 14;
let isLoading = false;

// ------------------------------ LOAD PRODUCTS ------------------------------
async function loadProducts(page = currentPage, pageSize = productsPerPage) {
  if (isLoading) return;

  isLoading = true;
  try {
    // Pobranie danych z API
    const response = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${page}&pageSize=${pageSize}`
    );

    const data = await response.json();

    // Sprawdzenie, czy odpowiedź zawiera dane produktów
    if (data && Array.isArray(data.data)) {
      renderProducts(data.data);
      currentPage++;
    } else {
      console.error("Nieprawidłowy format danych:", data);
    }

  } catch (error) {
    console.error("Błąd ładowania danych: ", error);
  } finally {
    isLoading = false;
  }
}

// ------------------------------ RENDER PRODUCTS ------------------------------
function renderProducts(products) {
  products.forEach((product) => {
    // Tworzenie karty produktu
    const productCard = document.createElement("div");
    productCard.className = "product-grid-card";

    // Wstawianie danych do karty produktu
    productCard.innerHTML = `
      <img class="grid-product-image" src="${product.image}" alt="${product.title}" />
      <div class="grid-product-id">ID: ${product.id}</div>
      <div hidden class="grid-product-title">${product.title}</div>
      <div hidden class="grid-product-price">${product.price}</div>
    `;

    // Dodanie eventu do kliknięcia w obrazek
    const image = productCard.querySelector(".grid-product-image");
    image.addEventListener("click", () => {
      openModal(product);
    });

    // Dodanie karty produktu do gridu
    productGrid.appendChild(productCard);
  });
}

// ------------------------------ CUSTOM SELECT ------------------------------
const customSelect = document.querySelector(".custom-select");
const selectButton = customSelect.querySelector(".select-button");
const selectedValue = customSelect.querySelector(".selected-value");
const dropdown = customSelect.querySelector(".select-dropdown");

selectButton.addEventListener("click", () => {
  customSelect.classList.toggle("active");
  dropdown.classList.toggle("hidden");
});

dropdown.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    const newSelected = e.target.textContent;
    const oldSelected = selectedValue.textContent;

    selectedValue.textContent = newSelected;
    e.target.textContent = oldSelected;

    const items = [...dropdown.querySelectorAll("li")]
      .map((li) => parseInt(li.textContent))
      .sort((a, b) => a - b);

    dropdown.innerHTML = items.map((val) => `<li>${val}</li>`).join("");

    dropdown.classList.add("hidden");
    customSelect.classList.remove("active");

    // Restart produktow po zmianie liczby produktów na stronę
    productsPerPage = parseInt(newSelected);
    currentPage = 1;
    const oldProducts = productGrid.querySelectorAll(".product-grid-card");
    oldProducts.forEach((el) => el.remove());
    loadProducts();
  }
});

document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    dropdown.classList.add("hidden");
    customSelect.classList.remove("active");
  }
});

// ------------------------------ INFINITE SCROLL ------------------------------
function checkScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

  if (bottom && !isLoading) {
    loadProducts();
  }
}

// Nasłuchuj przewijania
window.addEventListener("scroll", checkScroll);

// ------------------------------ START ------------------------------
loadProducts();

// ------------------------------ MODAL ------------------------------

function openModal(product) {
  const modal = document.getElementById("product-modal");
  modal.classList.remove("hidden");

  document.getElementById("modal-image").src = product.image;
  document.querySelector(".modal-product-id").textContent = `ID:${product.id}`;
  document.body.style.overflow = "hidden";
}

document.querySelector(".close-button").addEventListener("click", () => {
  document.getElementById("product-modal").classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Opcjonalnie zamykanie po kliknięciu w tło
document.getElementById("product-modal").addEventListener("click", (e) => {
  if (e.target.id === "product-modal") {
    document.getElementById("product-modal").classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});
