// Carrito de compras - Funcionalidad completa
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para abrir el carrito
function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    renderCart();
}

// Función para cerrar el carrito
function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Función para agregar producto al carrito
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Verificar si el producto tiene stock
    if (product.stock === 0) {
        alert('Este producto no está disponible actualmente.');
        return;
    }

    // Buscar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Verificar stock disponible
        if (existingItem.quantity + quantity > product.stock) {
            alert(`Solo hay ${product.stock} unidades disponibles de este producto.`);
            return;
        }
        existingItem.quantity += quantity;
    } else {
        // Calcular descuento individual del producto
        const discountAmount = product.hasDiscount && product.originalPrice ? 
            (product.originalPrice - product.price) : 0;
        
        // Agregar nuevo producto al carrito
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            hasDiscount: product.hasDiscount,
            discountAmount: discountAmount,
            image: product.image,
            quantity: quantity,
            stock: product.stock
        });
    }

    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar contador del carrito
    updateCartCounter();
    
    // Mostrar notificación
    const message = quantity === 1 ? 
        `${product.name} agregado al carrito` : 
        `${quantity} x ${product.name} agregados al carrito`;
    showNotification(message, 'success');
}

// Función para renderizar el carrito
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        cartFooter.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartFooter.style.display = 'block';
    
    // Renderizar items del carrito
    cartItems.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
    
    // Actualizar resumen
    updateCartSummary();
}

// Función para crear HTML de un item del carrito
function createCartItemHTML(item) {
    const subtotal = item.price * item.quantity;
    const originalSubtotal = item.originalPrice ? item.originalPrice * item.quantity : subtotal;
    
    const priceHTML = item.hasDiscount && item.originalPrice ? 
        `<div class="cart-item-price">
            <span class="text-muted text-decoration-line-through me-2">$${item.originalPrice.toFixed(2)}</span>
            <span class="text-success">$${item.price.toFixed(2)}</span>
        </div>` :
        `<div class="cart-item-price">$${item.price.toFixed(2)}</div>`;
    
    const subtotalHTML = item.hasDiscount && item.originalPrice ?
        `<div class="cart-item-subtotal">
            <span class="text-muted text-decoration-line-through me-2">$${originalSubtotal.toFixed(2)}</span>
            <span class="text-success">$${subtotal.toFixed(2)}</span>
        </div>` :
        `<div class="cart-item-subtotal">$${subtotal.toFixed(2)}</div>`;
    
    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-content">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" />
                </div>
                <div class="cart-item-details">
                    <h6 class="cart-item-name">${item.name}</h6>
                    ${priceHTML}
                    <div class="cart-item-controls">
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, -1)">
                            <i class="bi-dash"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, 1)">
                            <i class="bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    ${subtotalHTML}
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para actualizar cantidad de un producto
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > item.stock) {
        alert(`Solo hay ${item.stock} unidades disponibles de este producto.`);
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCounter();
    renderCart();
}

// Función para remover producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCounter();
    renderCart();
    
    showNotification('Producto removido del carrito', 'info');
}

// Función para vaciar el carrito
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCounter();
        renderCart();
        
        showNotification('Carrito vaciado', 'info');
    }
}

// Función para actualizar el resumen del carrito
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calcular subtotal con precios originales (antes de descuentos)
    const originalSubtotal = cart.reduce((sum, item) => {
        const originalPrice = item.originalPrice || item.price;
        return sum + (originalPrice * item.quantity);
    }, 0);
    
    // Calcular subtotal con precios finales (después de descuentos)
    const finalSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calcular descuento total
    const totalDiscount = originalSubtotal - finalSubtotal;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('subtotal').textContent = `$${originalSubtotal.toFixed(2)}`;
    
    const discountRow = document.getElementById('discountRow');
    if (totalDiscount > 0) {
        document.getElementById('discount').textContent = `-$${totalDiscount.toFixed(2)}`;
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    
    document.getElementById('total').innerHTML = `<strong>$${finalSubtotal.toFixed(2)}</strong>`;
}

// Función para actualizar contador del carrito
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

// Función para proceder al checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const originalSubtotal = cart.reduce((sum, item) => {
        const originalPrice = item.originalPrice || item.price;
        return sum + (originalPrice * item.quantity);
    }, 0);
    
    const finalSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = originalSubtotal - finalSubtotal;
    
    let message = `Procediendo al pago...\n\n`;
    message += `Subtotal: $${originalSubtotal.toFixed(2)}\n`;
    
    if (totalDiscount > 0) {
        message += `Descuento: -$${totalDiscount.toFixed(2)}\n`;
    }
    
    message += `Total: $${finalSubtotal.toFixed(2)}\n\n`;
    message += `(Esta es una simulación)`;
    
    alert(message);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideInRight 0.3s ease-out;';
    
    const icon = type === 'success' ? 'bi-check-circle' : 
                 type === 'info' ? 'bi-info-circle' : 'bi-exclamation-circle';
    
    notification.innerHTML = `
        <i class="${icon} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función para migrar carritos existentes a la nueva estructura
function migrateCart() {
    cart = cart.map(item => {
        // Si el item no tiene las nuevas propiedades, las agregamos
        if (!item.hasOwnProperty('originalPrice')) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                item.originalPrice = product.originalPrice;
                item.hasDiscount = product.hasDiscount;
                item.discountAmount = product.hasDiscount && product.originalPrice ? 
                    (product.originalPrice - product.price) : 0;
            }
        }
        return item;
    });
    
    // Guardar el carrito migrado
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para inicializar el carrito cuando esté todo listo
function initializeCart() {
    // Migrar carrito si es necesario
    if (cart.length > 0 && typeof products !== 'undefined') {
        migrateCart();
    }
    
    updateCartCounter();
}

// Función global para forzar la actualización del contador
window.refreshCartCounter = function() {
    updateCartCounter();
};

// Inicializar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Si los productos ya están cargados, inicializar inmediatamente
    if (typeof products !== 'undefined') {
        initializeCart();
    } else {
        // Si no, esperar a que se carguen
        const checkProducts = setInterval(() => {
            if (typeof products !== 'undefined') {
                clearInterval(checkProducts);
                initializeCart();
            }
        }, 100);
    }
});

// Cerrar carrito con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCart();
    }
});
