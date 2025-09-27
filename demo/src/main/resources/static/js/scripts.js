/*!
 * Versión adaptada para Thymeleaf (sin API REST)
 * Maneja únicamente carrito e interacciones.
 */

// Variable global para almacenar productos renderizados por Thymeleaf
let products = [];

// Variable global para el contador del carrito
let cartItemCount = 0;

// Función para inicializar productos desde el DOM (renderizados por Thymeleaf)
function initializeProducts() {
  const productElements = document.querySelectorAll("[data-product]");
  products = [];

  productElements.forEach((el) => {
    const product = {
      id: parseInt(el.dataset.id),
      name: el.dataset.name,
      price: parseFloat(el.dataset.price),
      originalPrice: el.dataset.originalPrice
        ? parseFloat(el.dataset.originalPrice)
        : null,
      image: el.dataset.image,
      hasDiscount: el.dataset.hasDiscount === "true",
      rating: parseInt(el.dataset.rating),
      stock: parseInt(el.dataset.stock),
      description: el.dataset.description || "",
      category: el.dataset.category || "General",
    };
    products.push(product);
  });
}

// Función para generar estrellas de rating
function generateStars(rating) {
  let stars = "";
  for (let i = 0; i < rating; i++) {
    stars += '<div class="bi-star-fill"></div>';
  }
  return stars;
}

// ------------------- CARRITO -------------------

function addToCart(productId, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  cart[productId] = (cart[productId] || 0) + quantity;
  localStorage.setItem("cart", JSON.stringify(cart));
  refreshCartCounter();
}

function addToCartFromMain(productId) {
  addToCart(productId, 1);
}

function addToCartFromDetail(productId) {
  const quantityInput = document.getElementById("inputQuantity");
  const quantity = parseInt(quantityInput.value) || 1;

  if (quantity < 1) {
    alert("La cantidad debe ser mayor a 0");
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (product && quantity > product.stock) {
    alert(`Solo hay ${product.stock} unidades disponibles de este producto.`);
    quantityInput.value = product.stock;
    return;
  }

  addToCart(productId, quantity);
  quantityInput.value = 1;
}

function refreshCartCounter() {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let count = Object.values(cart).reduce((a, b) => a + b, 0);
  const counter = document.getElementById("cart-counter");
  if (counter) {
    counter.textContent = count;
  }
}

// ------------------- DETALLE -------------------

function renderProductDetail(productId) {
  const product = products.find((p) => p.id === productId);
  const container = document.getElementById("product-detail-container");

  if (!product || !container) {
    return;
  }

  const discountBadge = product.hasDiscount
    ? '<span class="badge bg-danger me-2">En Oferta</span>'
    : "";

  const ratingSection = product.rating
    ? `<div class="d-flex align-items-center mb-3">
            <div class="d-flex text-warning me-2">
                ${generateStars(product.rating)}
            </div>
            <span class="text-muted">(${product.rating}.0)</span>
        </div>`
    : "";

  const priceSection = product.hasDiscount
    ? `<div class="mb-3">
            <span class="text-muted text-decoration-line-through fs-5 me-2">$${product.originalPrice.toFixed(
              2
            )}</span>
            <span class="fs-3 fw-bold text-success">$${product.price.toFixed(
              2
            )}</span>
        </div>`
    : `<div class="mb-3">
            <span class="fs-3 fw-bold">$${product.price.toFixed(2)}</span>
        </div>`;

  const stockSection =
    product.stock === 0
      ? `<div class="d-flex align-items-center mb-4">
            <span class="me-3 text-danger"><strong>Stock:</strong> Sin stock disponible</span>
            <span class="badge bg-danger">No disponible</span>
        </div>`
      : `<div class="d-flex align-items-center mb-4">
            <span class="me-3"><strong>Stock:</strong> ${product.stock} disponibles</span>
        </div>`;

  const actionSection =
    product.stock === 0
      ? `<div class="alert alert-warning" role="alert">
            <i class="bi-exclamation-triangle me-2"></i>
            Este producto no está disponible actualmente.
        </div>`
      : `<div class="d-flex">
            <input class="form-control text-center me-3" id="inputQuantity" 
                   type="number" value="1" min="1" max="${product.stock}" 
                   style="max-width: 5rem" />
            <button class="btn btn-outline-dark flex-shrink-0" type="button" 
                    onclick="addToCartFromDetail(${product.id})">
                <i class="bi-cart-fill me-1"></i>
                Agregar al carrito
            </button>
        </div>`;

  container.innerHTML = `
        <div class="row gx-4 gx-lg-5 align-items-center">
            <div class="col-md-6">
                <img class="card-img-top mb-5 mb-md-0" src="${product.image}" alt="${product.name}" />
            </div>
            <div class="col-md-6">
                <div class="small mb-1">${product.category}</div>
                <h1 class="display-5 fw-bolder">${product.name}</h1>
                ${discountBadge}
                ${ratingSection}
                ${priceSection}
                <p class="lead">${product.description}</p>
                ${stockSection}
                ${actionSection}
                <div class="mt-4">
                    <a href="/productos" class="btn btn-secondary">
                        <i class="bi-arrow-left me-1"></i>
                        Volver a la tienda
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ------------------- INIT -------------------

document.addEventListener("DOMContentLoaded", () => {
  initializeProducts();
  refreshCartCounter();
});
