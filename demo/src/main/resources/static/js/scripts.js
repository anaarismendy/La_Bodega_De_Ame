

/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/

// Variable global para almacenar productos
let products = [];

// Variable global para el contador del carrito
let cartItemCount = 0;

// Función para cargar productos desde JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        products = await response.json();
        return products;
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Fallback a productos hardcodeados si no se puede cargar el JSON
        products = [
            {
                id: 1,
                name: "Vino Tinto Premium",
                price: 45.00,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=450&h=300&fit=crop",
                hasDiscount: false,
                rating: 5,
                buttonText: "Add to cart",
                description: "Un exquisito vino tinto premium con cuerpo completo.",
                category: "Vinos",
                stock: 15
            }
            // Se pueden agregar más productos aquí si falla la carga del JSON
        ];
        return products;
    }
}

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Función para generar las estrellas de rating
function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
        stars += '<div class="bi-star-fill"></div>';
    }
    return stars;
}

// Función para crear el HTML de un producto en la lista
function createProductCard(product) {
    const discountBadge = product.hasDiscount ? 
        '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : '';
    
    const stockBadge = product.stock === 0 ? 
        '<div class="badge bg-danger text-white position-absolute" style="top: 0.5rem; left: 0.5rem">Sin Stock</div>' : '';
    
    const ratingSection = product.rating ? 
        `<div class="d-flex justify-content-center small text-warning mb-2">
            ${generateStars(product.rating)}
        </div>` : '';
    
    const priceSection = product.hasDiscount ? 
        `<span class="text-muted text-decoration-line-through">$${product.originalPrice.toFixed(2)}</span>
         $${product.price.toFixed(2)}` : 
        `$${product.price.toFixed(2)}`;

    const isOutOfStock = product.stock === 0;
    const cardClass = isOutOfStock ? 'card h-100 out-of-stock' : 'card h-100';
    const imageClass = isOutOfStock ? 'card-img-top out-of-stock-img' : 'card-img-top';

    return `
        <div class="col mb-5">
            <div class="${cardClass}" style="cursor: pointer;" onclick="viewProduct(${product.id})">
                ${discountBadge}
                ${stockBadge}
                <!-- Product image-->
                <img class="${imageClass}" src="${product.image}" alt="${product.name}" style="cursor: pointer;" />
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="fw-bolder" style="cursor: pointer;">${product.name}</h5>
                        ${ratingSection}
                        <!-- Product price-->
                        ${priceSection}
                        ${isOutOfStock ? '<p class="text-danger mt-2 mb-0"><small>No disponible</small></p>' : ''}
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        ${product.buttonText === "View options" ? 
                            `<a class="btn btn-outline-dark mt-auto" href="#" onclick="event.stopPropagation(); viewProduct(${product.id})">Ver detalle</a>` :
                            isOutOfStock ? 
                                `<a class="btn btn-outline-secondary mt-auto" href="#" onclick="event.stopPropagation(); viewProduct(${product.id})">Ver detalle</a>` :
                                `<a class="btn btn-outline-dark mt-auto" href="#" onclick="event.stopPropagation(); addToCartFromMain(${product.id})">${product.buttonText}</a>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para renderizar todos los productos
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) {
        console.log('Contenedor de productos no encontrado - probablemente estamos en página de detalle');
        return;
    }
    
    let productsHTML = '';
    products.forEach(product => {
        productsHTML += createProductCard(product);
    });
    
    container.innerHTML = productsHTML;
}

// Función para ver el detalle de un producto
function viewProduct(productId) {
    window.location.href = `item_detail.html?id=${productId}`;
}

// Función para renderizar el detalle del producto
function renderProductDetail() {
    const productId = parseInt(getUrlParameter('id'));
    const container = document.getElementById('product-detail-container');
    
    if (!container) {
        console.log('Contenedor de detalle no encontrado - probablemente estamos en página principal');
        return;
    }
    
    if (!productId) {
        container.innerHTML = '<div class="text-center"><h2>Producto no encontrado</h2><a href="index.html" class="btn btn-primary">Volver al inicio</a></div>';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        container.innerHTML = '<div class="text-center"><h2>Producto no encontrado</h2><a href="index.html" class="btn btn-primary">Volver al inicio</a></div>';
        return;
    }

    // Actualizar el título de la página
    document.title = `${product.name} - La Bodega de Ana`;

    const discountBadge = product.hasDiscount ? 
        '<span class="badge bg-danger me-2">En Oferta</span>' : '';
    
    const ratingSection = product.rating ? 
        `<div class="d-flex align-items-center mb-3">
            <div class="d-flex text-warning me-2">
                ${generateStars(product.rating)}
            </div>
            <span class="text-muted">(${product.rating}.0)</span>
        </div>` : '';
    
    const priceSection = product.hasDiscount ? 
        `<div class="mb-3">
            <span class="text-muted text-decoration-line-through fs-5 me-2">$${product.originalPrice.toFixed(2)}</span>
            <span class="fs-3 fw-bold text-success">$${product.price.toFixed(2)}</span>
            <span class="badge bg-success ms-2">${Math.round((1 - product.price/product.originalPrice) * 100)}% OFF</span>
        </div>` : 
        `<div class="mb-3">
            <span class="fs-3 fw-bold">$${product.price.toFixed(2)}</span>
        </div>`;

    const detailsSection = product.details ? 
        `<div class="row mt-4">
            <div class="col-12">
                <h6 class="fw-bold">Especificaciones:</h6>
                <ul class="list-unstyled">
                    ${Object.entries(product.details).map(([key, value]) => 
                        `<li><strong>${key}:</strong> ${value}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>` : '';

    const isOutOfStock = product.stock === 0;
    const stockClass = isOutOfStock ? 'out-of-stock-detail' : '';
    const imageClass = isOutOfStock ? 'card-img-top mb-5 mb-md-0 out-of-stock-img-detail' : 'card-img-top mb-5 mb-md-0';
    
    const stockSection = isOutOfStock ? 
        `<div class="d-flex align-items-center mb-4">
            <span class="me-3 text-danger"><strong>Stock:</strong> Sin stock disponible</span>
            <span class="badge bg-danger">No disponible</span>
        </div>` :
        `<div class="d-flex align-items-center mb-4">
            <span class="me-3"><strong>Stock:</strong> ${product.stock || 0} disponibles</span>
        </div>`;

    const actionSection = isOutOfStock ? 
        `<div class="d-flex align-items-center mb-4">
            <div class="alert alert-warning" role="alert">
                <i class="bi-exclamation-triangle me-2"></i>
                Este producto no está disponible actualmente. Puedes contactarnos para más información.
            </div>
        </div>
        <div class="d-flex">
            <button class="btn btn-outline-secondary flex-shrink-0 me-3" type="button" disabled>
                <i class="bi-cart-fill me-1"></i>
                Sin stock
            </button>
            <button class="btn btn-outline-info flex-shrink-0" type="button" onclick="contactForProduct(${product.id})">
                <i class="bi-envelope me-1"></i>
                Consultar disponibilidad
            </button>
        </div>` :
        `<div class="d-flex">
            <input class="form-control text-center me-3" id="inputQuantity" type="number" value="1" min="1" max="${product.stock || 1}" style="max-width: 5rem" />
            <button class="btn btn-outline-dark flex-shrink-0" type="button" onclick="addToCartFromDetail(${product.id})">
                <i class="bi-cart-fill me-1"></i>
                Agregar al carrito
            </button>
        </div>`;

    const productDetailHTML = `
        <div class="row gx-4 gx-lg-5 align-items-center ${stockClass}">
            <div class="col-md-6">
                <img class="${imageClass}" src="${product.image}" alt="${product.name}" />
            </div>
            <div class="col-md-6">
                <div class="small mb-1">${product.category || 'Categoría'}</div>
                <h1 class="display-5 fw-bolder">${product.name}</h1>
                ${discountBadge}
                ${ratingSection}
                ${priceSection}
                <p class="lead">${product.description || 'Descripción del producto no disponible.'}</p>
                ${stockSection}
                ${actionSection}
                ${detailsSection}
                <div class="mt-4">
                    <a href="index.html" class="btn btn-secondary">
                        <i class="bi-arrow-left me-1"></i>
                        Volver a la tienda
                    </a>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = productDetailHTML;
}

// Función para agregar al carrito desde la página de detalle
function addToCartFromDetail(productId) {
    const quantityInput = document.getElementById('inputQuantity');
    const quantity = parseInt(quantityInput.value) || 1;
    
    // Validar que la cantidad sea válida
    if (quantity < 1) {
        alert('La cantidad debe ser mayor a 0');
        return;
    }
    
    // Obtener el producto para validar stock
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
        alert(`Solo hay ${product.stock} unidades disponibles de este producto.`);
        quantityInput.value = product.stock;
        return;
    }
    
    addToCart(productId, quantity);
    
    // Resetear el input de cantidad a 1 después de agregar
    quantityInput.value = 1;
}

// Función para contactar sobre un producto sin stock
function contactForProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Has solicitado información sobre: ${product.name}\n\nTe contactaremos pronto para informarte sobre la disponibilidad de este producto.`);
    }
}

// Función para agregar al carrito (para la página principal)
function addToCartFromMain(productId) {
    addToCart(productId, 1);
}

// Función para actualizar el contador del carrito (deprecated - usar la del cart.js)
function updateCartCounter(quantity = 1) {
    // Esta función ahora está manejada por cart.js
    // Se mantiene por compatibilidad
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', async function() {
    await loadProducts();
    
    // Inicializar el carrito después de cargar los productos
    if (typeof initializeCart === 'function') {
        initializeCart();
    } else if (typeof window.refreshCartCounter === 'function') {
        window.refreshCartCounter();
    }
    
    // Verificar si estamos en la página de detalle
    const isDetailPage = window.location.pathname.includes('item_detail.html');
    
    if (isDetailPage) {
        renderProductDetail();
    } else {
        renderProducts();
    }
});