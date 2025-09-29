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

/**
 * Función para proceder al checkout - ahora abre el modal de cliente
 * Implementa el patrón Strategy para manejar diferentes flujos de checkout
 */
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Mostrar resumen del carrito en el modal
    renderCartSummaryInModal();
    
    // Abrir el modal de información del cliente
    const customerModal = new bootstrap.Modal(document.getElementById('customerModal'));
    customerModal.show();
}

/**
 * Renderiza el resumen del carrito dentro del modal de checkout
 */
function renderCartSummaryInModal() {
    const cartSummaryContainer = document.getElementById('cartSummaryCheckout');
    if (!cartSummaryContainer) return;

    let total = 0;
    let html = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="col-12 cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="max-height: 60px; width: 60px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1 text-dark">${item.name}</h6>
                        <small class="text-muted">${item.category}</small>
                    </div>
                    <div class="col-md-2 text-center">
                        <span class="badge bg-secondary">${item.quantity}</span>
                    </div>
                    <div class="col-md-2 text-center">
                        <span class="fw-bold text-success">$${itemTotal.toLocaleString()}</span>
                    </div>
                    <div class="col-md-2 text-end">
                        <small class="text-muted">$${item.price.toLocaleString()} c/u</small>
                    </div>
                </div>
            </div>
        `;
    });

    // Agregar total
    html += `
        <div class="col-12 mt-3 pt-3 border-top">
            <div class="row">
                <div class="col-8">
                    <h5 class="mb-0 text-dark">Total de tu Compra:</h5>
                </div>
                <div class="col-4 text-end">
                    <h4 class="mb-0 text-success fw-bold">$${total.toLocaleString()}</h4>
                </div>
            </div>
        </div>
    `;

    cartSummaryContainer.innerHTML = html;
}

/**
 * Función para guardar el cliente y luego el carrito
 * Implementa el patrón Chain of Responsibility: Cliente → Carrito
 */
async function saveCustomerAndCart() {
    try {
        // Mostrar loading en el botón
        const saveBtn = document.getElementById('saveCustomerBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="bi-arrow-clockwise spin me-1"></i>Guardando...';
        saveBtn.disabled = true;
        
        // Obtener datos del formulario
        const formData = getCustomerFormData();
        
        // Validar cédula
        if (!formData.clienteId || formData.clienteId.length < 8) {
            showNotification('La cédula debe tener al menos 8 caracteres', 'error');
            return;
        }
        
        // Guardar cliente en la base de datos
        const clienteResponse = await fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!clienteResponse.ok) {
            if (clienteResponse.status === 400) {
                showNotification('Error: La cédula ya existe o tiene un formato inválido', 'error');
                return;
            }
            throw new Error(`Error guardando cliente: ${clienteResponse.status}`);
        }
        
        const clienteGuardado = await clienteResponse.json();
        showNotification(`Cliente ${clienteGuardado.nombre} ${clienteGuardado.primerApellido} guardado exitosamente`, 'success');
        
        // Ahora guardar el carrito con el ID del cliente recién creado
        await saveCartWithClientId(clienteGuardado.clienteId);
        
        // Cerrar el modal
        const customerModal = bootstrap.Modal.getInstance(document.getElementById('customerModal'));
        customerModal.hide();
        
        // Resetear el formulario
        document.getElementById('customerForm').reset();
        
        // Limpiar el carrito después de la compra exitosa
        cart = [];
        updateCartDisplay();
        updateCartBadge();
        
        // Redirigir a la página de factura
        setTimeout(() => {
            window.location.href = '/factura';
        }, 1000);
        
    } catch (error) {
        console.error('Error en el proceso de checkout:', error);
        showNotification('Error al procesar la información. Inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar el botón
        const saveBtn = document.getElementById('saveCustomerBtn');
        saveBtn.innerHTML = '<i class="bi-check-circle me-1"></i>Guardar y Proceder al Pago';
        saveBtn.disabled = false;
    }
}

/**
 * Obtiene los datos del formulario de cliente
 * Implementa Single Responsibility: Solo maneja la extracción de datos del formulario
 * 
 * @returns {Object} Objeto con los datos del cliente
 */
function getCustomerFormData() {
    return {
        clienteId: document.getElementById('clienteId').value.trim(), // Cédula del cliente
        nombre: document.getElementById('nombre').value.trim(),
        primerApellido: document.getElementById('primerApellido').value.trim(),
        segundoApellido: document.getElementById('segundoApellido').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value ? parseInt(document.getElementById('telefono').value) : null,
        direccion: document.getElementById('direccion').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value || null,
        estado: 'activo'
    };
}

/**
 * Guarda el carrito en la base de datos con el ID del cliente especificado
 * Implementa Single Responsibility: Solo maneja el guardado del carrito
 * 
 * @param {string} clienteId ID del cliente
 * @returns {Promise<void>}
 */
async function saveCartWithClientId(clienteId) {
    try {
        // Convertir el carrito del frontend al formato del backend
        const carritoItems = cart.map(item => ({
            clienteId: clienteId,
            productoId: item.id,
            cantidad: item.quantity
        }));
        
        // Enviar al backend para guardar en la base de datos
        const response = await fetch('/api/carrito/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carritoItems)
        });
        
        if (response.ok) {
            // Éxito: Carrito guardado en la base de datos
            showNotification('Carrito guardado exitosamente. Procediendo al pago...', 'success');
            
            // Limpiar el carrito local después de guardar
            clearCartAfterCheckout();
            
            // TODO: Redirigir a la página de pago
            // window.location.href = '/checkout';
            
        } else {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Error guardando carrito en la base de datos:', error);
        showNotification('Error al guardar el carrito. Inténtalo de nuevo.', 'error');
        throw error; // Re-lanzar para que se maneje en la función padre
    }
}

/**
 * Limpia el carrito local después de un checkout exitoso
 * Implementa Single Responsibility: Solo maneja la limpieza del carrito local
 */
function clearCartAfterCheckout() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCounter();
    renderCart();
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
    
    // Inicializar el formulario de cliente
    initializeCustomerForm();
}

/**
 * Inicializa el formulario de cliente y sus event listeners
 * Implementa el patrón Observer para manejar eventos del formulario
 */
function initializeCustomerForm() {
    // Event listener para el formulario de cliente
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCustomerAndCart();
        });
    }
    
    // Validación en tiempo real para la cédula
    const cedulaInput = document.getElementById('clienteId');
    if (cedulaInput) {
        cedulaInput.addEventListener('input', function(e) {
            const cedula = e.target.value.trim();
            const feedback = document.getElementById('cedulaFeedback');
            
            // Crear elemento de feedback si no existe
            if (!feedback) {
                const feedbackElement = document.createElement('div');
                feedbackElement.id = 'cedulaFeedback';
                feedbackElement.className = 'form-text';
                e.target.parentNode.appendChild(feedbackElement);
            }
            
            const feedbackElement = document.getElementById('cedulaFeedback');
            
            if (cedula.length === 0) {
                feedbackElement.textContent = 'Ingrese su cédula';
                feedbackElement.className = 'form-text text-muted';
            } else if (cedula.length < 8) {
                feedbackElement.textContent = `Faltan ${8 - cedula.length} caracteres (mínimo 8)`;
                feedbackElement.className = 'form-text text-warning';
            } else {
                feedbackElement.textContent = '✓ Formato válido';
                feedbackElement.className = 'form-text text-success';
            }
        });
    }
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
